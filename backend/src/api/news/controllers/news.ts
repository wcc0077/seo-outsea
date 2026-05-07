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
}));
