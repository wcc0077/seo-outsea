export default {
  routes: [
    {
      method: 'GET',
      path: '/application-categories/by-slug/:slug',
      handler: 'application-category.findBySlug',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/application-categories/import',
      handler: 'application-category.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/application-categories/translate',
      handler: 'application-category.translate',
      config: { auth: false },
    },
  ],
};
