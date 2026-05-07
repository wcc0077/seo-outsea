import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::page.page').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['heroBanner', 'sections'],
    });

    if (!entity) {
      return ctx.notFound('Page not found');
    }

    return { data: entity };
  },
}));
