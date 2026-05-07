import { NextResponse } from 'next/server';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sitemaps = SUPPORTED_LOCALES.map((locale) => ({
    loc: `${siteUrl}/api/sitemap/${locale}`,
    lastmod: new Date().toISOString(),
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
