import https from 'https';
import http from 'http';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { factories } from '@strapi/strapi';

interface ScrapedRfidTag {
  name: string;
  model: string;
  slug: string;
  description: string;
  tagType: string;
  frequency: string;
  category: string;
  parentCategory: string;
  subcategory: string;
  specsRaw: string;
  specsText: string;
  mainImage: string;
  images: string[];
  seoTitle: string;
  seoKeywords: string;
  url: string;
}

function loadRfidTagsFromJson(): ScrapedRfidTag[] {
  const filePath = path.resolve(__dirname, '../../../../../scripts/scraped-data/rfid-tags.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`RFID tags file not found: ${filePath}. Run 'npx tsx scripts/scrape-fn-tech.ts' first.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

export default factories.createCoreController('api::rfid-tag.rfid-tag', ({ strapi }) => ({
  async import(ctx) {
    const existingCount = await strapi.db.query('api::rfid-tag.rfid-tag').count();
    if (existingCount > 0) {
      return { data: null, error: `RFID tags already exist (${existingCount}). Skipping import.` };
    }

    let tags: ScrapedRfidTag[];
    try {
      tags = loadRfidTagsFromJson();
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }

    // Filter out reader products mistakenly listed as tags (e.g., D1604)
    const readerNamePattern = /(读写器|读写模块|网关控制器|读写)/;
    const filteredTags = tags.filter((t) => !readerNamePattern.test(t.name));

    const results: { created: number; failed: number; errors: string[] } = {
      created: 0, failed: 0, errors: [],
    };

    for (const tag of filteredTags) {
      try {
        // Find category by scraped subcategory name
        const category = await strapi.db.query('api::product-category.product-category').findOne({
          where: { name: tag.subcategory || tag.category },
        });

        if (!category) {
          results.failed++;
          results.errors.push(
            `No category found for: ${tag.name} (subcategory: ${tag.subcategory})`
          );
          continue;
        }

        // Download and upload images (up to 3)
        let imageConnect: number[] = [];
        for (const imgUrl of tag.images.slice(0, 3)) {
          try {
            const filename = imgUrl.split('/').pop() || 'image.jpg';
            const buffer = await downloadImage(imgUrl);
            const uploaded = await strapi.plugin('upload').services.upload.upload({
              data: {},
              files: {
                name: filename,
                type: 'image/jpeg',
                size: buffer.length,
                path: './',
                stream: Readable.from(buffer),
              },
            });
            if (Array.isArray(uploaded)) {
              imageConnect.push(...uploaded.map((f: any) => f.id));
            } else if (uploaded) {
              imageConnect.push((uploaded as any).id);
            }
          } catch {
            // Image failed, continue
          }
        }

        // Clean description
        const cleanDesc = tag.description
          .replace(/\s+/g, ' ')
          .trim();

        // Extract model from name if not present
        const model = tag.model || tag.name.match(/^([A-Z0-9]+)/)?.[1] || '';

        await strapi.documents('api::rfid-tag.rfid-tag').create({
          data: {
            name: tag.name,
            model,
            slug: tag.slug,
            description: cleanDesc || tag.name,
            tagType: tag.tagType as any,
            frequency: tag.frequency as any,
            category: category.documentId,
            imageUrl: tag.mainImage,
            images: imageConnect,
            seoTitle: tag.seoTitle,
            seoKeywords: tag.seoKeywords,
          },
          status: 'published',
        });

        results.created++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${tag.name}: ${err.message}`);
      }

      await new Promise((r) => setTimeout(r, 300));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::rfid-tag.rfid-tag').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['images', 'specs'],
    });

    if (!entity) {
      return ctx.notFound('RFID tag not found');
    }

    return { data: entity };
  },

  async findByType(ctx) {
    const { type } = ctx.params;
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
      where: { tagType: type, locale: locale || 'en' },
      populate: ['images'],
    });

    return { data: entities };
  },

  async findByCategory(ctx) {
    const { slug } = ctx.params;
    const { locale, page = '1', pageSize = '12' } = ctx.query;

    const category = await strapi.db.query('api::product-category.product-category').findOne({
      where: { slug, locale: locale || 'en', publishedAt: { $notNull: true } },
    });

    if (!category) {
      return ctx.notFound('RFID tag category not found');
    }

    const entities = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
      where: { category: category.id, locale: locale || 'en' },
      populate: ['images', 'category'],
      orderBy: 'name',
    });

    return { data: entities, category };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['rfid-tag'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::rfid-tag.rfid-tag').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::rfid-tag.rfid-tag').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            applicationScenarios: item.applicationScenarios as string,
            slug: sourceRecord.slug,
            model: sourceRecord.model,
            tagType: sourceRecord.tagType,
            frequency: sourceRecord.frequency,
            imageUrl: sourceRecord.imageUrl,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate RFID tag id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'rfid-tag',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },

  async cleanup(ctx) {
    const { confirm } = ctx.query;

    if (confirm !== 'yes') {
      return { error: 'Add ?confirm=yes to execute cleanup' };
    }

    const results = {
      duplicatesDeleted: 0,
      published: 0,
      errors: [] as string[],
    };

    try {
      // 1. Get all RFID tags
      const allTags = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
        populate: ['category'],
        orderBy: { id: 'asc' },
      });

      // 2. Group by documentId + locale to find duplicates
      const grouped: Record<string, number[]> = {};
      for (const t of allTags) {
        const key = `${t.documentId}_${t.locale}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t.id);
      }

      // 3. Delete duplicates (keep lowest id)
      const duplicates = Object.entries(grouped).filter(([_, ids]) => ids.length > 1);
      for (const [key, ids] of duplicates) {
        const keepId = ids[0];
        const deleteIds = ids.slice(1);
        for (const delId of deleteIds) {
          try {
            await strapi.db.query('api::rfid-tag.rfid-tag').delete({ where: { id: delId } });
            results.duplicatesDeleted++;
          } catch (err: any) {
            results.errors.push(`Failed to delete id=${delId}: ${err.message}`);
          }
        }
      }

      // 4. Publish tags with category
      const unpublished = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
        where: {
          publishedAt: null,
          category: { $notNull: true },
          slug: { $notNull: true },
        },
      });

      for (const t of unpublished) {
        try {
          await strapi.db.query('api::rfid-tag.rfid-tag').update({
            where: { id: t.id },
            data: { publishedAt: new Date().toISOString() },
          });
          results.published++;
        } catch (err: any) {
          results.errors.push(`Failed to publish id=${t.id}: ${err.message}`);
        }
      }

      // 5. Final stats
      const finalTags = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
        where: { publishedAt: { $notNull: true } },
      });

      return {
        success: true,
        results,
        finalStats: {
          totalPublished: finalTags.length,
        },
      };
    } catch (err: any) {
      return { success: false, error: err.message, results };
    }
  },
}));