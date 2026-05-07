import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product-category.product-category', ({ strapi }) => ({
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
