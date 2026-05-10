export default {
  register({ strapi }) {
    strapi.server.use(async (ctx, next) => {
      if (ctx.method === 'GET') {
        // ── Products list ──
        if (ctx.path === '/api/products') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::product.product').findMany({
            where: { locale: locale || 'en', publishedAt: { $notNull: true } },
            populate: ['category', 'images'],
            orderBy: { createdAt: 'desc' },
          });
          // Deduplicate by documentId
          const seen = new Set();
          const unique = results.filter(r => {
            if (seen.has(r.documentId)) return false;
            seen.add(r.documentId);
            return true;
          });
          ctx.body = { data: unique };
          ctx.status = 200;
          return;
        }

        // ── Applications list ──
        if (ctx.path === '/api/applications') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::application.application').findMany({
            where: { locale: locale || 'en', publishedAt: { $notNull: true } },
            populate: ['category', 'images'],
            orderBy: { createdAt: 'desc' },
          });
          // Deduplicate by documentId
          const seen = new Set();
          const unique = results.filter(r => {
            if (seen.has(r.documentId)) return false;
            seen.add(r.documentId);
            return true;
          });
          ctx.body = { data: unique };
          ctx.status = 200;
          return;
        }

        // ── Global settings ──
        if (ctx.path === '/api/global') {
          const result = await strapi.db.query('api::global.global').findOne({
            populate: ['logo', 'socialLinks', 'socialLinks.qrCode'],
          });
          ctx.body = { data: result };
          ctx.status = 200;
          return;
        }

        // ── Product categories ──
        if (ctx.path === '/api/product-categories') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::product-category.product-category').findMany({
            where: { locale: locale || 'en', publishedAt: { $notNull: true } },
            populate: ['parent', 'children'],
            orderBy: { sortOrder: 'asc' },
          });
          ctx.body = { data: results };
          ctx.status = 200;
          return;
        }

        // ── Application categories ──
        if (ctx.path === '/api/application-categories') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::application-category.application-category').findMany({
            where: { locale: locale || 'en', publishedAt: { $notNull: true } },
            orderBy: { sortOrder: 'asc' },
          });
          // Deduplicate by documentId
          const seen = new Set();
          const unique = results.filter(r => {
            if (seen.has(r.documentId)) return false;
            seen.add(r.documentId);
            return true;
          });
          ctx.body = { data: unique };
          ctx.status = 200;
          return;
        }

        // ── RFID tags list ──
        if (ctx.path === '/api/rfid-tags') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
            where: { locale: locale || 'en', publishedAt: { $notNull: true } },
            populate: ['category', 'images'],
            orderBy: { createdAt: 'desc' },
          });
          // Deduplicate by documentId
          const seen = new Set();
          const unique = results.filter(r => {
            if (seen.has(r.documentId)) return false;
            seen.add(r.documentId);
            return true;
          });
          ctx.body = { data: unique };
          ctx.status = 200;
          return;
        }

        // ── RFID tags by category ──
        if (ctx.path.match(/^\/api\/rfid-tags\/by-category\//)) {
          const slug = ctx.path.replace('/api/rfid-tags/by-category/', '');
          const { locale } = ctx.query;

          const category = await strapi.db.query('api::product-category.product-category').findOne({
            where: { slug, locale: locale || 'en', publishedAt: { $notNull: true } },
          });

          if (!category) {
            ctx.status = 404;
            ctx.body = { data: null, error: 'Category not found' };
            return;
          }

          const results = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
            where: { category: category.id, locale: locale || 'en', publishedAt: { $notNull: true } },
            populate: ['category', 'images'],
            orderBy: { name: 'asc' },
          });
          // Deduplicate by documentId
          const seen = new Set();
          const unique = results.filter(r => {
            if (seen.has(r.documentId)) return false;
            seen.add(r.documentId);
            return true;
          });
          ctx.body = { data: unique, category };
          ctx.status = 200;
          return;
        }

        // ── About pages list ──
        if (ctx.path === '/api/about-pages') {
          const { locale } = ctx.query;
          const results = await strapi.db.query('api::about-page.about-page').findMany({
            where: { locale: locale || 'en' },
            populate: ['images'],
            orderBy: { sortOrder: 'asc' },
          });
          ctx.body = { data: results };
          ctx.status = 200;
          return;
        }

        // ── News published (existing) ──
        if (ctx.path === '/api/news/published') {
          const { locale } = ctx.query;
          const page = parseInt(ctx.query.page as string) || 1;
          const pageSize = parseInt(ctx.query.pageSize as string) || 10;

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

        // ── News by slug (existing) ──
        if (ctx.path.match(/^\/api\/news\/by-slug\//)) {
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
      }

      await next();
    });
  },
  bootstrap({ strapi }) {},
};
