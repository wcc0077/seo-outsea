export default {
  routes: [
    {
      method: 'GET',
      path: '/clients',
      handler: 'client.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/clients/published',
      handler: 'client.published',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/clients/import',
      handler: 'client.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/clients/translate',
      handler: 'client.translate',
      config: { auth: false },
    },
  ],
};
