export default {
  routes: [
    {
      method: 'GET',
      path: '/product-categories/by-slug/:slug',
      handler: 'product-category.findBySlug',
      config: { auth: false },
    },
  ],
};
