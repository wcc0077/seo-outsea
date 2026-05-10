import { factories } from '@strapi/strapi';
import https from 'https';
import http from 'http';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

interface ScrapedProduct {
  name: string;
  slug: string;
  description: string;
  features: string[];
  specsRaw: string;
  specsText: string;
  mainImage: string;
  images: string[];
  category: string;
  parentCategory: string;
  subcategory: string;
  frequency: string;
  os: string;
  connectivity: string[];
  seoTitle: string;
  seoKeywords: string;
  url: string;
}

function loadProductsFromJson(): ScrapedProduct[] {
  const filePath = path.resolve(__dirname, '../../../../../scripts/scraped-data/products.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Products file not found: ${filePath}. Run 'npx tsx scripts/scrape-fn-tech.ts' first.`);
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

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    const { locale, populate } = ctx.query;

    const entities = await strapi.db.query('api::product.product').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      populate: populate || ['images', 'category', 'tags'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: entities, meta: {} };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::product.product').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['category', 'specs', 'images', 'tags'],
    });

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    return { data: entity };
  },

  async findByCategory(ctx) {
    const { categorySlug } = ctx.params;
    const { locale } = ctx.query;

    const category = await strapi.db.query('api::product-category.product-category').findOne({
      where: { slug: categorySlug, locale: locale || 'en', publishedAt: { $notNull: true } },
    });

    if (!category) {
      return ctx.notFound('Category not found');
    }

    const products = await strapi.db.query('api::product.product').findMany({
      where: { category: category.id, locale: locale || 'en' },
      populate: ['images', 'category'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: products, meta: { category } };
  },

  async importProducts(ctx) {
    const existingCount = await strapi.db.query('api::product.product').count();
    if (existingCount > 0) {
      return { data: null, error: `Products already exist (${existingCount}). Skipping import.` };
    }

    let products: ScrapedProduct[];
    try {
      products = loadProductsFromJson();
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }

    const results: { created: number; failed: number; errors: string[] } = {
      created: 0, failed: 0, errors: [],
    };

    for (const product of products) {
      try {
        // Find category by scraped subcategory name
        const category = await strapi.db.query('api::product-category.product-category').findOne({
          where: { name: product.subcategory || product.category },
        });

        if (!category) {
          results.failed++;
          results.errors.push(
            `No category found for: ${product.name} (subcategory: ${product.subcategory})`
          );
          continue;
        }

        // Download and upload images (up to 5)
        let imageConnect: number[] = [];
        for (const imgUrl of product.images.slice(0, 5)) {
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

        // Clean description: collapse whitespace
        const cleanDesc = product.description.replace(/\s+/g, ' ').trim();

        // Parse and filter specs — remove navigation/category keys
        let specsRaw: Record<string, string>;
        try {
          specsRaw = JSON.parse(product.specsRaw);
        } catch {
          specsRaw = {};
        }

        const skipKeys = new Set([
          '购买人', '属性', '会员级别', '购买时间',
          '多功能手持终端', '多功能工业平板', '便携式RFID读写器',
          '高频系列RFID读写器', '超高频系列RFID读写器', '工业协议网关控制器',
          '有源系列RFID读写器', '低频系列RFID读写器', 'RFID集成产品',
          'RFID工业载码体', 'RFID耐高温标签', 'RFID抗金属标签',
          'RFID易碎防转移标签', '智能卡与不干胶标签', '其他特种标签', '有源电子标签',
          '智能制造', '仓储物流', '档案图书', '资产巡检',
          '防伪追溯', '连锁零售', '智慧城市', '智能柜体',
        ]);

        const specItems = Object.entries(specsRaw)
          .filter(([k]) => !skipKeys.has(k) && k.length < 40)
          .map(([label, value]) => ({ name: label.trim(), value: value.trim() }))
          .filter((s) => s.name.length > 0 && s.value.length > 0);

        await strapi.documents('api::product.product').create({
          data: {
            name: product.name,
            slug: product.slug,
            description: cleanDesc || product.name,
            category: category.documentId,
            imageUrl: product.mainImage,
            images: imageConnect,
            rfidFrequency: (product.frequency as any) || undefined,
            os: (product.os as any) || undefined,
            features: product.features.filter((f) => f.length > 5),
            connectivity: product.connectivity,
            seoTitle: product.seoTitle,
            seoKeywords: product.seoKeywords,
            specs: specItems,
          },
          status: 'published',
        });

        results.created++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${product.name}: ${err.message}`);
      }

      await new Promise((r) => setTimeout(r, 300));
    }

    return { data: results };
  },

  async listAll(ctx) {
    const products = await strapi.db.query('api::product.product').findMany({
      populate: ['category'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: products };
  },

  async cleanup(ctx) {
    const { confirm } = ctx.query;

    if (confirm !== 'yes') {
      return { error: 'Add ?confirm=yes to execute cleanup' };
    }

    const results = {
      duplicatesDeleted: 0,
      slugsFixed: 0,
      published: 0,
      errors: [] as string[],
    };

    try {
      // 1. Get all products
      const allProducts = await strapi.db.query('api::product.product').findMany({
        populate: ['category'],
        orderBy: { id: 'asc' },
      });

      // 2. Group by documentId + locale to find duplicates
      const grouped: Record<string, number[]> = {};
      for (const p of allProducts) {
        const key = `${p.documentId}_${p.locale}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p.id);
      }

      // 3. Delete duplicates (keep lowest id)
      const duplicates = Object.entries(grouped).filter(([_, ids]) => ids.length > 1);
      for (const [key, ids] of duplicates) {
        const keepId = ids[0];
        const deleteIds = ids.slice(1);
        for (const delId of deleteIds) {
          try {
            await strapi.db.query('api::product.product').delete({ where: { id: delId } });
            results.duplicatesDeleted++;
          } catch (err: any) {
            results.errors.push(`Failed to delete id=${delId}: ${err.message}`);
          }
        }
      }

      // 4. Fix empty slugs - use direct SQL update for uid fields
      const emptySlugProducts = await strapi.db.query('api::product.product').findMany({
        where: {
          $or: [{ slug: null }, { slug: '' }],
        },
      });

      for (const p of emptySlugProducts) {
        try {
          const baseSlug = p.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);

          let slug = baseSlug;
          let counter = 1;
          const existing = await strapi.db.query('api::product.product').findOne({
            where: { slug, id: { $ne: p.id } },
          });
          while (existing) {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }

          // Direct SQL query to bypass uid field validation (SQLite/Knex)
          const knex = strapi.db.connection;
          await knex('products').where('id', p.id).update({ slug });
          results.slugsFixed++;
        } catch (err: any) {
          results.errors.push(`Failed to fix slug for id=${p.id}: ${err.message}`);
        }
      }

      // 5. Publish products with category
      const unpublished = await strapi.db.query('api::product.product').findMany({
        where: {
          publishedAt: null,
          category: { $notNull: true },
          slug: { $notNull: true },
        },
      });

      for (const p of unpublished) {
        try {
          await strapi.db.query('api::product.product').update({
            where: { id: p.id },
            data: { publishedAt: new Date().toISOString() },
          });
          results.published++;
        } catch (err: any) {
          results.errors.push(`Failed to publish id=${p.id}: ${err.message}`);
        }
      }

      // 6. Final stats
      const finalProducts = await strapi.db.query('api::product.product').findMany({
        where: { publishedAt: { $notNull: true } },
      });

      return {
        success: true,
        results,
        finalStats: {
          totalPublished: finalProducts.length,
        },
      };
    } catch (err: any) {
      return { success: false, error: err.message, results };
    }
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::product.product').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['product'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::product.product').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::product.product').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            slug: sourceRecord.slug,
            locale: toLocale,
            category: sourceRecord.category,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate product id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'product',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));