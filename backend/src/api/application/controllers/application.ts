import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::application.application', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::application.application').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['images'],
    });

    if (!entity) {
      return ctx.notFound('Application not found');
    }

    return { data: entity };
  },
}));
