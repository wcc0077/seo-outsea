import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Default locales — will be overridden by Strapi at runtime
const SUPPORTED_LOCALES = ['en', 'zh', 'fr', 'de', 'es', 'ru'];
const DEFAULT_LOCALE = 'en';

export async function loadLocale(locale: string) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
  };
}

export default getRequestConfig(async ({ locale }) => loadLocale(locale));

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
