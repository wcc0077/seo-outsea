// frontend/lib/seo-config.ts

export const SEO_CONFIG = {
  siteName: 'FN Tech',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fn-tech.com',
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh', 'fr', 'de', 'es', 'ru'] as const,
  localesWithRegion: ['en-US', 'zh-CN', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU'] as const,
} as const;

export const SITEMAP_CONFIG = {
  revalidate: 3600, // 1 hour default
  newsRevalidate: 300, // 5 minutes for news
  maxUrlCount: 1000,
} as const;

export const ROBOTS_TXT_CONFIG = {
  allowAll: '*',
  crawlDelays: {
    Googlebot: 1,
    Bingbot: 1,
    Baiduspider: 2,
    YandexBot: 1,
  },
  allowedLLMBots: [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'GoogleExtended',
    'CCBot',
    'Bytespider',
    'AppleBot',
    'Anthropic-AI',
  ],
} as const;

export type Locale = typeof SEO_CONFIG.supportedLocales[number];
