import fs from 'fs';
import path from 'path';

interface ScrapedArticle {
  title: string;
  url: string;
  date: string;
  content: string;
}

export default {
  async find(ctx) {
    const results = await strapi.db.query('api::news.article').findMany({});
    return { data: results };
  },

  async findOne(ctx) {
    const entity = await strapi.db.query('api::news.article').findOne({
      where: { id: ctx.params.id },
    });
    if (!entity) {
      return ctx.notFound('News not found');
    }
    return { data: entity };
  },

  async create(ctx) {
    const entity = await strapi.db.query('api::news.article').create({
      data: ctx.request.body.data,
    });
    return { data: entity };
  },

  async update(ctx) {
    const entity = await strapi.db.query('api::news.article').update({
      where: { id: ctx.params.id },
      data: ctx.request.body.data,
    });
    return { data: entity };
  },

  async delete(ctx) {
    const entity = await strapi.db.query('api::news.article').delete({
      where: { id: ctx.params.id },
    });
    return { data: entity };
  },

  async getPublishedNews(ctx) {
    const { locale } = ctx.query;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 10;

    const { results, pagination } = await strapi.db.query('api::news.article').findPage({
      where: { locale: locale || 'zh', publishedAt: { $notNull: true } },
      populate: ['coverImage'],
      orderBy: { publishDate: 'desc' },
      page,
      pageSize,
    });

    return { data: results, meta: { pagination } };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;
    const targetLocale = locale || 'zh';

    const entity = await strapi.db.connection('news')
      .where('slug', slug)
      .andWhere('locale', targetLocale)
      .first();

    if (!entity) {
      return ctx.notFound('News not found');
    }

    return { data: entity };
  },

  async importNews(ctx) {
    const existingCount = await strapi.db.query('api::news.article').count();
    if (existingCount > 0) {
      return { data: null, error: `News articles already exist (${existingCount}). Skipping import.` };
    }

    const possiblePaths = [
      path.join(process.cwd(), 'scripts', 'fn-tech-news.json'),
      path.join(process.cwd(), '..', '..', 'tmp', 'fn-tech-news.json'),
      '/tmp/fn-tech-news.json',
    ];

    let dataPath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dataPath = p;
        break;
      }
    }

    if (!dataPath) {
      return ctx.badRequest('News data file not found. Place fn-tech-news.json in backend/scripts/ or /tmp/');
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const articles: ScrapedArticle[] = JSON.parse(rawData);
    const results = { created: 0, failed: 0, errors: [] as string[] };

    for (const article of articles) {
      try {
        const slug = article.title
          .toLowerCase()
          .replace(/[^\w一-鿿\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 100);

        if (!slug) continue;

        const existing = await strapi.db.query('api::news.article').findOne({
          where: { slug },
        });

        if (existing) {
          results.failed++;
          continue;
        }

        await strapi.db.query('api::news.article').create({
          data: {
            title: article.title,
            slug,
            content: article.content,
            publishDate: article.date,
            author: '孚恩科技',
            publishedAt: article.date || new Date().toISOString(),
            locale: 'en',
          },
        });

        results.created++;
      } catch (err: unknown) {
        results.failed++;
        const msg = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push(`Failed to import "${article.title.substring(0, 40)}": ${msg}`);
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
};
