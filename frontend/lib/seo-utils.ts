// frontend/lib/seo-utils.ts

import { SEO_CONFIG, Locale } from './seo-config';

/**
 * Build a locale-prefixed URL
 */
export function localeUrl(locale: Locale, path: string = ''): string {
  return `${SEO_CONFIG.siteUrl}/${locale}${path}`;
}

/**
 * Build hreflang alternates for a given path across all locales
 */
export function buildAlternates(path: string): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};

  for (const loc of SEO_CONFIG.supportedLocales) {
    languages[loc] = localeUrl(loc, path);
  }
  // Add x-default pointing to default locale
  languages['x-default'] = localeUrl(SEO_CONFIG.defaultLocale, path);

  return { languages };
}
