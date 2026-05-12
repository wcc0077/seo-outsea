import { factories } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

interface CategoryRecord {
  name: string;
  slug: string;
  parent: string | null;
  sortOrder: number;
}

function loadCategoriesFromJson(): CategoryRecord[] {
  const filePath = path.resolve(__dirname, '../../../../../scripts/scraped-data/categories.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Categories file not found: ${filePath}. Run 'npx tsx scripts/scrape-fn-tech.ts' first.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

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

    let categories: CategoryRecord[];
    try {
      categories = loadCategoriesFromJson();
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }

    const results: { topCategories: number; childCategories: number; errors: string[] } = { topCategories: 0, childCategories: 0, errors: [] };

    // Separate top-level (parent=null) from children
    const topCategories = categories.filter((c) => c.parent === null);
    const childCategories = categories.filter((c) => c.parent !== null);

    // Step 1: Create top-level categories
    for (const cat of topCategories) {
      try {
        await strapi.documents('api::product-category.product-category').create({
          data: { name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder },
          status: 'published',
        });
        results.topCategories++;
      } catch (err: any) {
        results.errors.push(`Top category failed: ${cat.name} - ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 100));
    }

    // Step 2: Create child categories with parent relations
    const slugToDocId: Record<string, string> = {};
    const allCategories = await strapi.db.query('api::product-category.product-category').findMany({});
    for (const cat of allCategories) {
      slugToDocId[cat.slug] = cat.documentId;
    }

    for (const child of childCategories) {
      try {
        const parentDocId = child.parent ? slugToDocId[child.parent] : null;
        if (!parentDocId) {
          results.errors.push(`Child category missing parent: ${child.name} (parent slug: ${child.parent})`);
          continue;
        }
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
      await new Promise((r) => setTimeout(r, 100));
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
