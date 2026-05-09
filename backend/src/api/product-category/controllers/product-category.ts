import https from 'https';
import http from 'http';
import { Readable } from 'stream';

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

// Top-level product categories
const TOP_CATEGORIES = [
  { name: 'RFID读写器', slug: 'rfid-readers', sortOrder: 1 },
  { name: 'RFID电子标签', slug: 'rfid-tags', sortOrder: 2 },
  { name: '智能移动终端', slug: 'mobile-devices', sortOrder: 3 },
];

// Second-level categories (linked to parents via parentId lookup)
const CHILD_CATEGORIES = [
  { name: '高频系列RFID读写器', slug: 'hf-rfid-readers', parentSlug: 'rfid-readers', sortOrder: 1 },
  { name: '超高频系列RFID读写器', slug: 'uhf-rfid-readers', parentSlug: 'rfid-readers', sortOrder: 2 },
  { name: '工业协议网关控制器', slug: 'gateway-controllers', parentSlug: 'rfid-readers', sortOrder: 3 },
  { name: '有源系列RFID读写器', slug: 'active-rfid-readers', parentSlug: 'rfid-readers', sortOrder: 4 },
  { name: '低频系列RFID读写器', slug: 'lf-rfid-readers', parentSlug: 'rfid-readers', sortOrder: 5 },
  { name: '多功能手持终端', slug: 'handheld-terminals', parentSlug: 'mobile-devices', sortOrder: 1 },
  { name: '多功能工业平板', slug: 'industrial-tablets', parentSlug: 'mobile-devices', sortOrder: 2 },
  { name: '便携式RFID读写器', slug: 'portable-readers', parentSlug: 'mobile-devices', sortOrder: 3 },
  { name: '工业载码体', slug: 'industrial-carriers', parentSlug: 'rfid-tags', sortOrder: 1 },
  { name: '耐高温标签', slug: 'high-temp-tags', parentSlug: 'rfid-tags', sortOrder: 2 },
  { name: '抗金属标签', slug: 'anti-metal-tags', parentSlug: 'rfid-tags', sortOrder: 3 },
  { name: '易碎防转移标签', slug: 'fragile-tags', parentSlug: 'rfid-tags', sortOrder: 4 },
  { name: '智能卡与不干胶标签', slug: 'cards-adhesive-tags', parentSlug: 'rfid-tags', sortOrder: 5 },
  { name: '其他特种标签', slug: 'special-tags', parentSlug: 'rfid-tags', sortOrder: 6 },
  { name: '有源电子标签', slug: 'active-tags', parentSlug: 'rfid-tags', sortOrder: 7 },
];

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product-category.product-category', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::product-category.product-category').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      populate: ['parent', 'children'],
      orderBy: { sortOrder: 'asc' },
    });

    // Group children by parent's documentId
    const childMap = new Map<string, typeof entities>();
    for (const cat of entities) {
      if (cat.parent?.documentId) {
        if (!childMap.has(cat.parent.documentId)) childMap.set(cat.parent.documentId, []);
        childMap.get(cat.parent.documentId)!.push(cat);
      }
    }

    // Attach grouped children to parent categories
    for (const cat of entities) {
      if (cat.documentId && childMap.has(cat.documentId)) {
        cat.children = childMap.get(cat.documentId)!;
      }
    }

    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::product-category.product-category').count();
    if (existingCount > 0) {
      return { data: null, error: `Product categories already exist (${existingCount}). Skipping import.` };
    }

    const results: { topCategories: number; childCategories: number; errors: string[] } = { topCategories: 0, childCategories: 0, errors: [] };

    // Step 1: Create top-level categories (published)
    for (const cat of TOP_CATEGORIES) {
      try {
        await strapi.documents('api::product-category.product-category').create({
          data: {
            name: cat.name,
            slug: cat.slug,
            sortOrder: cat.sortOrder,
          },
          status: 'published',
        });
        results.topCategories++;
      } catch (err: any) {
        results.errors.push(`Top category failed: ${cat.name} - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    // Step 2: Create child categories with parent relations (published)
    const slugToDocId: Record<string, string> = {};
    const allCategories = await strapi.db.query('api::product-category.product-category').findMany({});
    for (const cat of allCategories) {
      slugToDocId[cat.slug] = cat.documentId;
    }

    for (const child of CHILD_CATEGORIES) {
      try {
        const parentDocId = slugToDocId[child.parentSlug];
        await strapi.documents('api::product-category.product-category').create({
          data: {
            name: child.name,
            slug: child.slug,
            sortOrder: child.sortOrder,
            parent: parentDocId,
          },
          status: 'published',
        });
        results.childCategories++;
      } catch (err: any) {
        results.errors.push(`Child category failed: ${child.name} - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::product-category.product-category').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['parent', 'children'],
    });

    if (!entity) {
      return ctx.notFound('Product category not found');
    }

    return { data: entity };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::product-category.product-category').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['product-category'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const existing = await strapi.db.query('api::product-category.product-category').findOne({
          where: { slug: (item._id as number), locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        const sourceRecord = records.find((r) => r.id === item._id);
        await strapi.db.query('api::product-category.product-category').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            slug: sourceRecord?.slug,
            locale: toLocale,
            sortOrder: sourceRecord?.sortOrder,
            publishedAt: sourceRecord?.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate category id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'product-category',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
