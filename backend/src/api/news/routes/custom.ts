export default {
  routes: [
    // Custom routes
    {
      method: 'GET',
      path: '/news/published',
      handler: 'news.getPublishedNews',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/news-slug/:slug',
      handler: 'news.findBySlug',
      config: { auth: false },
    },
    // Core CRUD
    {
      method: 'GET',
      path: '/news',
      handler: 'news.find',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/news/:id',
      handler: 'news.findOne',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/news',
      handler: 'news.create',
      config: { policies: [] },
    },
    {
      method: 'PUT',
      path: '/news/:id',
      handler: 'news.update',
      config: { policies: [] },
    },
    {
      method: 'DELETE',
      path: '/news/:id',
      handler: 'news.delete',
      config: { policies: [] },
    },
  ],
};
