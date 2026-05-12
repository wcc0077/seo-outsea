// frontend/app/robots.ts

import { MetadataRoute } from 'next';
import { SEO_CONFIG, ROBOTS_TXT_CONFIG } from '@/lib/seo-config';

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots['rules'] = [];

  // Default rule for all other bots
  rules.push({ userAgent: '*', allow: '/' });

  // Add crawl delay for specific search engine bots
  for (const [bot, delay] of Object.entries(ROBOTS_TXT_CONFIG.crawlDelays)) {
    rules.push({ userAgent: bot, allow: '/', crawlDelay: delay });
  }

  // Add LLM bots (without crawl delay)
  const coveredBots = new Set(Object.keys(ROBOTS_TXT_CONFIG.crawlDelays));
  for (const bot of ROBOTS_TXT_CONFIG.allowedLLMBots) {
    if (!coveredBots.has(bot)) {
      rules.push({ userAgent: bot, allow: '/' });
    }
  }

  return {
    rules,
    sitemap: [`${SEO_CONFIG.siteUrl}/sitemap.xml`],
  };
}
