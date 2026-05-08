export default {
  register({ strapi }) {
    // Use Express/Koa middleware to intercept routes BEFORE Strapi RBAC
    strapi.server.use(async (ctx, next) => {
      if (ctx.method === 'GET' && ctx.path === '/api/news/published') {
        const { locale } = ctx.query;
        const page = parseInt(ctx.query.page as string) || 1;
        const pageSize = parseInt(ctx.query.pageSize as string) || 10;

        // Try requested locale first, fallback to en if empty
        let { results, pagination } = await strapi.db.query('api::news.article').findPage({
          where: { locale: locale || 'en', publishedAt: { $notNull: true } },
          populate: ['coverImage'],
          orderBy: { publishDate: 'desc' },
          page,
          pageSize,
        });

        if (results.length === 0 && locale && locale !== 'en') {
          const fallback = await strapi.db.query('api::news.article').findPage({
            where: { locale: 'en', publishedAt: { $notNull: true } },
            populate: ['coverImage'],
            orderBy: { publishDate: 'desc' },
            page,
            pageSize,
          });
          results = fallback.results;
          pagination = fallback.pagination;
        }

        ctx.body = { data: results, meta: { pagination } };
        ctx.status = 200;
        return;
      }

      if (ctx.method === 'GET' && ctx.path.match(/^\/api\/news\/by-slug\//)) {
        const slug = ctx.path.replace('/api/news/by-slug/', '');
        const { locale } = ctx.query;

        let entity = await strapi.db.query('api::news.article').findOne({
          where: { slug, locale: locale || 'en' },
          populate: ['coverImage'],
        });

        if (!entity && locale && locale !== 'en') {
          entity = await strapi.db.query('api::news.article').findOne({
            where: { slug, locale: 'en' },
            populate: ['coverImage'],
          });
        }

        if (!entity) {
          ctx.status = 404;
          ctx.body = { data: null, error: 'News not found' };
          return;
        }

        ctx.body = { data: entity };
        ctx.status = 200;
        return;
      }

      await next();
    });
  },
  bootstrap({ strapi }) {},
};
