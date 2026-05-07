export default ({ env }) => ({
  i18n: {
    enabled: true,
    config: {
      locales: ['en', 'zh'],
      defaultLocale: 'en',
    },
  },
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 10485760, // 10MB
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
