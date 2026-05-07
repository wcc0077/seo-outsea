'use client';

import { useLocale } from 'next-intl';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
}

export default function MetaTags({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  alternateLocales,
}: MetaTagsProps) {
  const locale = useLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* hreflang */}
      {alternateLocales?.map(({ locale: altLocale, url }) => (
        <link key={altLocale} rel="alternate" hrefLang={altLocale} href={`${siteUrl}/${altLocale}${url}`} />
      ))}
    </>
  );
}
