// frontend/app/sitemap-others.ts

import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';

const staticPages = [
  { slug: '', priority: 1.0, changefreq: 'daily' as const },
  { slug: '/about', priority: 0.8, changefreq: 'monthly' as const },
  { slug: '/about/company', priority: 0.7, changefreq: 'monthly' as const },
  { slug: '/about/history', priority: 0.7, changefreq: 'monthly' as const },
  { slug: '/about/honors', priority: 0.7, changefreq: 'monthly' as const },
  { slug: '/support', priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/sharing', priority: 0.8, changefreq: 'weekly' as const },
  { slug: '/contact', priority: 0.9, changefreq: 'monthly' as const },
];

export default async function sitemapOthers({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  return staticPages.map((page) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}${page.slug}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq,
    priority: page.priority,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}${page.slug}`,
        ])
      ),
    },
  }));
}
