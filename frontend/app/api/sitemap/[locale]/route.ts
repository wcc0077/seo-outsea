import { NextRequest, NextResponse } from 'next/server';
import { getAllPages, getProducts, getApplications, getPublishedNews } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [pages, products, applications, newsResult] = await Promise.all([
    getAllPages(locale).catch(() => []),
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 100).catch(() => ({ data: [] })),
  ]);

  const entries = [
    // Static pages
    { loc: `${siteUrl}/${locale}`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/${locale}/about`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/${locale}/products`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/${locale}/applications`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/${locale}/news`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
    { loc: `${siteUrl}/${locale}/support`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.6' },
    { loc: `${siteUrl}/${locale}/contact`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.6' },
    { loc: `${siteUrl}/${locale}/sharing`, lastmod: new Date().toISOString(), changefreq: 'monthly', priority: '0.6' },
    // CMS-managed pages
    ...pages.map((p) => ({
      loc: `${siteUrl}/${locale}/${p.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    })),
    // Product category pages
    ...products
      .filter((p, i, arr) => arr.findIndex((x) => x.category?.slug === p.category?.slug) === i)
      .map((p) => ({
        loc: `${siteUrl}/${locale}/products/category/${p.category?.slug}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      })),
    // Product detail pages
    ...products.map((p) => ({
      loc: `${siteUrl}/${locale}/products/${p.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // Application pages
    ...applications.map((a) => ({
      loc: `${siteUrl}/${locale}/applications/${a.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // News pages
    ...newsResult.data.map((n) => ({
      loc: `${siteUrl}/${locale}/news/${n.slug}`,
      lastmod: new Date(n.publishDate).toISOString(),
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (e) => `
  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
