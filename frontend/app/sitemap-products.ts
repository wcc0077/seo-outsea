// frontend/app/sitemap-products.ts

import { MetadataRoute } from 'next';
import { getProducts, getProductCategories } from '@/lib/strapi';
import { SEO_CONFIG } from '@/lib/seo-config';

export default async function sitemapProducts({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  const [products, categories] = await Promise.all([
    getProducts(locale).catch(() => []),
    getProductCategories(locale).catch(() => []),
  ]);

  const categoryUrls = categories.map((cat) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/products/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/products/category/${cat.slug}`,
        ])
      ),
    },
  }));

  const productUrls = products.map((product) => ({
    url: `${SEO_CONFIG.siteUrl}/${locale}/products/${product.slug}`,
    lastModified: product.publishedAt ? new Date(product.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries(
        SEO_CONFIG.supportedLocales.map((loc) => [
          loc,
          `${SEO_CONFIG.siteUrl}/${loc}/products/${product.slug}`,
        ])
      ),
    },
  }));

  return [...categoryUrls, ...productUrls];
}
