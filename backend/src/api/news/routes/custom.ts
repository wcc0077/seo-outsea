export default {
  routes: [
    {
      method: 'POST',
      path: '/news/import',
      handler: 'news.importNews',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/news/translate',
      handler: 'news.translate',
      config: { auth: false },
    },
  ],
};
