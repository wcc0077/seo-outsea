export default {
  routes: [
    {
      method: 'GET',
      path: '/about-pages/by-slug/:slug',
      handler: 'about-page.findBySlug',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/about-pages/by-type/:pageType',
      handler: 'about-page.findByType',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/about-pages/import',
      handler: 'about-page.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/about-pages/translate',
      handler: 'about-page.translate',
      config: { auth: false },
    },
  ],
};
