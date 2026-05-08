export default {
  routes: [
    {
      method: 'GET',
      path: '/news',
      handler: 'news.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/news/:id',
      handler: 'news.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/news',
      handler: 'news.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/news/:id',
      handler: 'news.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/news/:id',
      handler: 'news.delete',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/news/by-slug/:slug',
      handler: 'news.findBySlug',
      config: { auth: false, policies: [] },
    },
    {
      method: 'GET',
      path: '/news/published',
      handler: 'news.getPublished',
      config: { auth: false, policies: [] },
    },
  ],
};
