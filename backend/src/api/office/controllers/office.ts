import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::office.office', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::office.office').findMany({
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

    const entities = await strapi.db.query('api::office.office').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::office.office').count();
    if (existingCount > 0) {
      return { data: null, error: `Offices already exist (${existingCount}). Skipping import.` };
    }

    const { data, locale } = ctx.request.body as {
      data: Record<string, unknown>[];
      locale?: string;
    };

    if (!data || !Array.isArray(data)) {
      return ctx.badRequest('Missing data array in request body');
    }

    const targetLocale = locale || 'zh';
    const results: { created: number; failed: number; errors: string[] } = {
      created: 0,
      failed: 0,
      errors: [],
    };

    for (const item of data) {
      try {
        await strapi.documents('api::office.office').create({
          data: {
            name: item.name as string,
            address: item.address as string,
            phone: item.phone as string,
            phone2: item.phone2 as string,
            fax: item.fax as string,
            email: item.email as string,
            website: item.website as string,
            zipCode: item.zipCode as string,
            lat: item.lat as number,
            lng: item.lng as number,
            isHQ: (item.isHQ as boolean) || false,
            sortOrder: (item.sortOrder as number) || 0,
          },
          locale: targetLocale,
          status: 'published',
        });

        results.created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.failed++;
        results.errors.push(`Failed to import office "${item.name}": ${msg}`);
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

    const records = await strapi.db.query('api::office.office').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = ['name', 'address'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord) continue;

        const existing = await strapi.db.query('api::office.office').findOne({
          where: { name: sourceRecord.name, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::office.office').create({
          data: {
            name: item.name as string,
            address: item.address as string,
            phone: sourceRecord.phone,
            phone2: sourceRecord.phone2,
            fax: sourceRecord.fax,
            email: sourceRecord.email,
            website: sourceRecord.website,
            zipCode: sourceRecord.zipCode,
            lat: sourceRecord.lat,
            lng: sourceRecord.lng,
            isHQ: sourceRecord.isHQ,
            sortOrder: sourceRecord.sortOrder,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate office id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'office',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
