export default {
  routes: [
    {
      method: 'POST',
      path: '/news/translate',
      handler: 'news.translate',
      config: { auth: false },
    },
  ],
};
