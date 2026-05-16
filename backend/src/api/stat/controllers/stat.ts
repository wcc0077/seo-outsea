import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::stat.stat', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::stat.stat').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async published(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::stat.stat').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::stat.stat').count();
    if (existingCount > 0) {
      return { data: null, error: `Stats already exist (${existingCount}). Skipping import.` };
    }

    const { data, locale = 'zh' } = ctx.request.body as {
      data: Array<{ value: string; label: string; sortOrder?: number }>;
      locale?: string;
    };

    if (!Array.isArray(data) || data.length === 0) {
      return ctx.badRequest('Missing or empty data array');
    }

    const results: { created: number; failed: number; errors: string[] } = {
      created: 0,
      failed: 0,
      errors: [],
    };

    for (const item of data) {
      try {
        await strapi.documents('api::stat.stat').create({
          data: {
            value: item.value,
            label: item.label,
            sortOrder: item.sortOrder ?? 0,
          },
          locale,
          status: 'published',
        });
        results.created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.failed++;
        results.errors.push(`Failed to import stat "${item.label}": ${msg}`);
      }
    }

    return { data: results };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::stat.stat').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = ['value', 'label'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord) continue;

        const existing = await strapi.db.query('api::stat.stat').findOne({
          where: { value: sourceRecord.value, label: sourceRecord.label, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::stat.stat').create({
          data: {
            value: item.value as string,
            label: item.label as string,
            sortOrder: sourceRecord.sortOrder,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate stat id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'stat',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
