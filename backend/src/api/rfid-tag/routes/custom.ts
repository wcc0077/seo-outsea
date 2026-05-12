export default {
  routes: [
    {
      method: 'GET',
      path: '/rfid-tags/by-slug/:slug',
      handler: 'rfid-tag.findBySlug',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/rfid-tags/by-type/:type',
      handler: 'rfid-tag.findByType',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/rfid-tags/by-category/:slug',
      handler: 'rfid-tag.findByCategory',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/rfid-tags/import',
      handler: 'rfid-tag.import',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/rfid-tags/cleanup',
      handler: 'rfid-tag.cleanup',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/rfid-tags/translate',
      handler: 'rfid-tag.translate',
      config: { auth: false },
    },
  ],
};
