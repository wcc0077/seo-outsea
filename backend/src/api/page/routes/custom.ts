export default {
  routes: [
    {
      method: 'GET',
      path: '/pages/by-slug/:slug',
      handler: 'page.findBySlug',
      config: { auth: false },
    },
  ],
};
