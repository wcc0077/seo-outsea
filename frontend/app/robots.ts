// frontend/app/robots.ts

import { MetadataRoute } from 'next';
import { SEO_CONFIG, ROBOTS_TXT_CONFIG } from '@/lib/seo-config';

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: ROBOTS_TXT_CONFIG.allowAll,
      allow: '/',
    },
  ];

  // Add crawl delay for specific bots
  Object.entries(ROBOTS_TXT_CONFIG.crawlDelays).forEach(([bot, delay]) => {
    rules.push({
      userAgent: bot,
      allow: '/',
      crawlDelay: delay,
    });
  });

  // Add LLM bots
  ROBOTS_TXT_CONFIG.allowedLLMBots.forEach((bot) => {
    rules.push({
      userAgent: bot,
      allow: '/',
    });
  });

  const sitemapUrls = [
    `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  ];

  // Add locale-specific sitemaps
  SEO_CONFIG.supportedLocales.forEach((locale) => {
    sitemapUrls.push(`${SEO_CONFIG.siteUrl}/sitemap-${locale}.xml`);
  });

  return {
    rules,
    sitemap: sitemapUrls,
  };
}
