export default {
  routes: [
    {
      method: 'GET',
      path: '/rfid-tag-categories',
      handler: 'rfid-tag-category.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/rfid-tag-categories/by-slug/:slug',
      handler: 'rfid-tag-category.findBySlug',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/rfid-tag-categories/import',
      handler: 'rfid-tag-category.import',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/rfid-tag-categories/translate',
      handler: 'rfid-tag-category.translate',
      config: { auth: false },
    },
  ],
};
