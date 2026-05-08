import { factories } from '@strapi/strapi';

const TAG_CATEGORIES = [
  { name: 'RFID工业载码体', slug: 'industrial-carriers', sortOrder: 1 },
  { name: 'RFID耐高温标签', slug: 'high-temp-tags', sortOrder: 2 },
  { name: 'RFID抗金属标签', slug: 'anti-metal-tags', sortOrder: 3 },
  { name: 'RFID易碎防转移标签', slug: 'fragile-tags', sortOrder: 4 },
  { name: '智能卡与不干胶标签', slug: 'cards-adhesive-tags', sortOrder: 5 },
  { name: '其他特种标签', slug: 'special-tags', sortOrder: 6 },
  { name: '有源电子标签', slug: 'active-tags', sortOrder: 7 },
];

export default factories.createCoreController('api::rfid-tag-category.rfid-tag-category', ({ strapi }) => ({
  async import(ctx) {
    const existingCount = await strapi.db.query('api::rfid-tag-category.rfid-tag-category').count();
    if (existingCount > 0) {
      return { data: null, error: `RFID tag categories already exist (${existingCount}). Skipping import.` };
    }

    const results: { created: number; errors: string[] } = { created: 0, errors: [] };

    for (const cat of TAG_CATEGORIES) {
      try {
        await strapi.documents('api::rfid-tag-category.rfid-tag-category').create({
          data: {
            name: cat.name,
            slug: cat.slug,
            sortOrder: cat.sortOrder,
          },
          status: 'published',
        });
        results.created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push(`Category failed: ${cat.name} - ${msg}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::rfid-tag-category.rfid-tag-category').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['parent', 'children'],
    });

    if (!entity) {
      return ctx.notFound('RFID tag category not found');
    }

    return { data: entity };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::rfid-tag-category.rfid-tag-category').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['rfid-tag-category'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const existing = await strapi.db.query('api::rfid-tag-category.rfid-tag-category').findOne({
          where: { slug: (item._id as number), locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        const sourceRecord = records.find((r) => r.id === item._id);
        await strapi.db.query('api::rfid-tag-category.rfid-tag-category').create({
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
      contentType: 'rfid-tag-category',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
