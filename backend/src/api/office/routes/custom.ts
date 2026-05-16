export default {
  routes: [
    {
      method: 'GET',
      path: '/offices',
      handler: 'office.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/offices/published',
      handler: 'office.published',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/offices/import',
      handler: 'office.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/offices/translate',
      handler: 'office.translate',
      config: { auth: false },
    },
  ],
};
