import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::news.article', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::news.article').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['coverImage'],
    });

    if (!entity) {
      return ctx.notFound('News not found');
    }

    return { data: entity };
  },

  async getPublished(ctx) {
    const { locale } = ctx.query;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 10;

    const { results, pagination } = await strapi.db.query('api::news.article').findPage({
      where: { locale: locale || 'en', publishedAt: { $notNull: true } },
      populate: ['coverImage'],
      orderBy: { publishDate: 'desc' },
      page,
      pageSize,
    });

    return { data: results, meta: { pagination } };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::news.article').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['article'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::news.article').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::news.article').create({
          data: {
            title: item.title as string,
            content: item.content as string,
            author: item.author as string,
            slug: sourceRecord.slug,
            publishDate: sourceRecord.publishDate,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate news id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'news',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
