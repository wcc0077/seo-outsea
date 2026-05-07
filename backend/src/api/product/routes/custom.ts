export default {
  routes: [
    {
      method: 'GET',
      path: '/products/by-slug/:slug',
      handler: 'product.findBySlug',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/products/by-category/:categorySlug',
      handler: 'product.findByCategory',
      config: { auth: false },
    },
  ],
};
