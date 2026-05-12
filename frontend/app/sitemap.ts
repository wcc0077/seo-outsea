// frontend/app/sitemap.ts

import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapUrls = SEO_CONFIG.supportedLocales.flatMap((locale) => [
    `${SEO_CONFIG.siteUrl}/${locale}/sitemap-products-${locale}.xml`,
    `${SEO_CONFIG.siteUrl}/${locale}/sitemap-applications-${locale}.xml`,
    `${SEO_CONFIG.siteUrl}/${locale}/sitemap-news-${locale}.xml`,
    `${SEO_CONFIG.siteUrl}/${locale}/sitemap-others-${locale}.xml`,
  ]);

  return [
    {
      url: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...sitemapUrls.map((url) => ({
      url,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ];
}
