// frontend/app/sitemap-applications.ts

import { MetadataRoute } from 'next';
import { getApplications, getApplicationCategories } from '@/lib/strapi';
import { SEO_CONFIG } from '@/lib/seo-config';

export default async function sitemapApplications({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  const [applications, categories] = await Promise.all([
    getApplications(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
  ]);

  const categoryUrls = categories.map((cat) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/applications/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/applications/${cat.slug}`,
        ])
      ),
    },
  }));

  const applicationUrls = applications.map((app) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/applications/${app.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/applications/${app.slug}`,
        ])
      ),
    },
  }));

  return [...categoryUrls, ...applicationUrls];
}
