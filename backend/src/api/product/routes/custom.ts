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
    {
      method: 'POST',
      path: '/products/import',
      handler: 'product.importProducts',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/products/all',
      handler: 'product.listAll',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/products/translate',
      handler: 'product.translate',
      config: { auth: false },
    },
  ],
};
