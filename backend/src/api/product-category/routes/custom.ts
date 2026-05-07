export default {
  routes: [
    {
      method: 'GET',
      path: '/product-categories',
      handler: 'product-category.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/product-categories/by-slug/:slug',
      handler: 'product-category.findBySlug',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/product-categories/import',
      handler: 'product-category.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/product-categories/translate',
      handler: 'product-category.translate',
      config: { auth: false },
    },
  ],
};
