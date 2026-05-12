// frontend/components/seo/MetaTags.tsx

'use client';

import { useLocale } from 'next-intl';
import { SEO_CONFIG } from '@/lib/seo-config';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function MetaTags({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  alternateLocales,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: MetaTagsProps) {
  const locale = useLocale() as typeof SEO_CONFIG.supportedLocales[number];
  const siteUrl = SEO_CONFIG.siteUrl;
  const fullUrl = canonical || `${siteUrl}/${locale}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : 'zh_CN'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:secure_url" content={ogImage} />}
      {ogImage && <meta property="og:image:type" content="image/jpeg" />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      {/* Article specific Open Graph */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:site" content="@fntech" />

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* hreflang */}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/en`} />
      {SEO_CONFIG.supportedLocales.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`${siteUrl}/${loc}${canonical || ''}`}
        />
      ))}

      {/* Dublin Core */}
      <meta name="DC.title" content={title} />
      <meta name="DC.description" content={description} />
      <meta name="DC.language" content={locale} />
      {author && <meta name="DC.creator" content={author} />}

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#2563eb" />
    </>
  );
}
