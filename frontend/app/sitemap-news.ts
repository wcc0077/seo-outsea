// frontend/app/sitemap-news.ts

import { MetadataRoute } from 'next';
import { getPublishedNews } from '@/lib/strapi';
import { SEO_CONFIG } from '@/lib/seo-config';

export default async function sitemapNews({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  const { data: articles } = await getPublishedNews(locale, 1, 100).catch(() => ({
    data: [],
  }));

  return articles.map((article) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/news/${article.slug}`,
    lastModified: article.publishDate ? new Date(article.publishDate) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/news/${article.slug}`,
        ])
      ),
    },
  }));
}
