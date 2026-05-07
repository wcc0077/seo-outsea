import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::product.product').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['category', 'specs', 'images'],
    });

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    return { data: entity };
  },

  async findByCategory(ctx) {
    const { categorySlug } = ctx.params;
    const { locale } = ctx.query;

    const category = await strapi.db.query('api::product-category.product-category').findOne({
      where: { slug: categorySlug, locale: locale || 'en' },
    });

    if (!category) {
      return ctx.notFound('Category not found');
    }

    const products = await strapi.db.query('api::product.product').findMany({
      where: { category: category.id, locale: locale || 'en' },
      populate: ['images', 'category'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: products, meta: { category } };
  },
}));
