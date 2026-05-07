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
}));
