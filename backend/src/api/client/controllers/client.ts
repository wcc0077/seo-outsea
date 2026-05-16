import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::client.client', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::client.client').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      populate: { logo: true },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async published(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::client.client').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      populate: { logo: true },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::client.client').count();
    if (existingCount > 0) {
      return { data: null, error: `Clients already exist (${existingCount}). Skipping import.` };
    }

    const { data, locale = 'zh' } = ctx.request.body as {
      data: Array<{ name: string; logo?: number; sortOrder?: number }>;
      locale?: string;
    };

    if (!Array.isArray(data) || data.length === 0) {
      return ctx.badRequest('Missing or empty data array in request body');
    }

    const results = { created: 0, failed: 0, errors: [] as string[] };

    for (const item of data) {
      try {
        await strapi.documents('api::client.client').create({
          data: {
            name: item.name,
            logo: item.logo,
            sortOrder: item.sortOrder ?? 0,
          },
          locale,
          status: 'published',
        });
        results.created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.failed++;
        results.errors.push(`${item.name}: ${msg}`);
      }
    }

    return { data: results };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::client.client').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['client'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord) continue;

        const existing = await strapi.db.query('api::client.client').findOne({
          where: { documentId: sourceRecord.documentId, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::client.client').create({
          data: {
            name: item.name as string,
            logo: sourceRecord.logo,
            sortOrder: sourceRecord.sortOrder,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate client id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'client',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
