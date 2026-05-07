import createMiddleware from 'next-intl/middleware';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/i18n';

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(en|zh)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
