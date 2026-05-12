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

  // Main sitemap index contains all locale-specific sub-sitemaps
  return {
    rules,
    sitemap: [`${SEO_CONFIG.siteUrl}/sitemap.xml`],
  };
}
