import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::application.application').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      populate: ['images', 'category'],
      orderBy: { updatedAt: 'desc' },
    });

    // Deduplicate by documentId to handle Strapi i18n duplicates
    const seen = new Set();
    const unique = entities.filter(e => {
      if (seen.has(e.documentId)) return false;
      seen.add(e.documentId);
      return true;
    });

    return { data: unique, meta: {} };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::application.application').findOne({
      where: { slug, locale: locale || 'en', publishedAt: { $notNull: true } },
      populate: ['images', 'category'],
    });

    if (!entity) {
      return ctx.notFound('Application not found');
    }

    return { data: entity };
  },

  async findByCategory(ctx) {
    const { categorySlug } = ctx.params;
    const { locale } = ctx.query;

    // Find the category first (published version)
    const category = await strapi.db.query('api::application-category.application-category').findOne({
      where: { slug: categorySlug, locale: locale || 'en', publishedAt: { $notNull: true } },
    });

    if (!category) {
      return ctx.notFound('Application category not found');
    }

    const entities = await strapi.db.query('api::application.application').findMany({
      where: { category: category.id, locale: locale || 'en', publishedAt: { $notNull: true } },
      populate: ['images', 'category'],
      orderBy: { name: 'asc' },
    });

    return { data: entities };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::application.application').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['application'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::application.application').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::application.application').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            useCase: item.useCase as string,
            slug: sourceRecord.slug,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate application id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'application',
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
      // 1. Get all applications
      const allApps = await strapi.db.query('api::application.application').findMany({
        populate: ['category'],
        orderBy: { id: 'asc' },
      });

      // 2. Group by documentId + locale to find duplicates
      const grouped: Record<string, number[]> = {};
      for (const app of allApps) {
        const key = `${app.documentId}_${app.locale}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(app.id);
      }

      // 3. Delete duplicates (keep lowest id)
      const duplicates = Object.entries(grouped).filter(([_, ids]) => ids.length > 1);
      for (const [key, ids] of duplicates) {
        const keepId = ids[0];
        const deleteIds = ids.slice(1);
        for (const delId of deleteIds) {
          try {
            await strapi.db.query('api::application.application').delete({ where: { id: delId } });
            results.duplicatesDeleted++;
          } catch (err: any) {
            results.errors.push(`Failed to delete id=${delId}: ${err.message}`);
          }
        }
      }

      // 4. Publish applications with category and slug
      const unpublished = await strapi.db.query('api::application.application').findMany({
        where: {
          publishedAt: null,
          category: { $notNull: true },
          slug: { $notNull: true },
        },
      });

      for (const app of unpublished) {
        try {
          await strapi.db.query('api::application.application').update({
            where: { id: app.id },
            data: { publishedAt: new Date().toISOString() },
          });
          results.published++;
        } catch (err: any) {
          results.errors.push(`Failed to publish id=${app.id}: ${err.message}`);
        }
      }

      // 5. Final stats
      const finalApps = await strapi.db.query('api::application.application').findMany({
        where: { publishedAt: { $notNull: true } },
      });

      return {
        success: true,
        results,
        finalStats: {
          totalPublished: finalApps.length,
        },
      };
    } catch (err: any) {
      return { success: false, error: err.message, results };
    }
  },
}));
