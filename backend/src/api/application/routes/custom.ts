export default {
  routes: [
    {
      method: 'GET',
      path: '/applications/by-slug/:slug',
      handler: 'application.findBySlug',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/applications/by-category/:categorySlug',
      handler: 'application.findByCategory',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/applications/translate',
      handler: 'application.translate',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/applications/cleanup',
      handler: 'application.cleanup',
      config: { auth: false },
    },
  ],
};