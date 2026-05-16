export default {
  routes: [
    {
      method: 'GET',
      path: '/stats',
      handler: 'stat.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/stats/published',
      handler: 'stat.published',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/stats/import',
      handler: 'stat.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/stats/translate',
      handler: 'stat.translate',
      config: { auth: false },
    },
  ],
};
