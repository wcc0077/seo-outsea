import { MetadataRoute } from 'next';
import { getRfidTags, getRfidTagCategories } from '@/lib/strapi';
import { SEO_CONFIG } from '@/lib/seo-config';

export default async function sitemapRfidTags({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  const [tags, categories] = await Promise.all([
    getRfidTags(locale).catch(() => []),
    getRfidTagCategories(locale).catch(() => []),
  ]);

  const categoryUrls = categories.map((cat) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/rfid-tags/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/rfid-tags/category/${cat.slug}`,
        ])
      ),
    },
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/rfid-tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/rfid-tags/${tag.slug}`,
        ])
      ),
    },
  }));

  return [...categoryUrls, ...tagUrls];
}