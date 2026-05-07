export default {
  routes: [
    {
      method: 'GET',
      path: '/faq-articles',
      handler: 'faq-article.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/faq-articles/:id',
      handler: 'faq-article.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/faq-articles/by-slug/:slug',
      handler: 'faq-article.findBySlug',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/faq/knowledge',
      handler: 'faq-article.getPublished',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/faq-articles/import',
      handler: 'faq-article.importArticles',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/faq-articles/translate',
      handler: 'faq-article.translate',
      config: { auth: false },
    },
  ],
};
