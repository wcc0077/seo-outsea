# Global SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive global SEO optimization with multi-language sitemap, geo-friendly robots.txt, enhanced meta tags, structured data, and ISR performance optimization.

**Architecture:** Next.js 15 App Router with Strapi 5 CMS. ISR for dynamic sitemap generation with proper hreflang annotations. Geo-targeting via robots.txt directives. JSON-LD structured data for rich search results.

**Tech Stack:** Next.js 15, Strapi 5, TypeScript, next-intl, JSON-LD

---

## File Structure

```
frontend/
├── app/
│   ├── sitemap.ts                    # Main sitemap index
│   ├── sitemap-products.ts           # Product sitemap
│   ├── sitemap-applications.ts       # Application sitemap
│   ├── sitemap-news.ts               # News sitemap
│   ├── sitemap-others.ts            # Static pages sitemap
│   └── robots.ts                     # Dynamic robots.txt
├── components/seo/
│   ├── MetaTags.tsx                  # Enhanced meta tags
│   ├── JsonLd.tsx                    # JSON-LD utilities
│   ├── StructuredData.tsx            # Structured data components (NEW)
│   └── GeoMeta.tsx                   # Geo targeting meta tags (NEW)
└── lib/
    ├── seo-config.ts                  # SEO constants (NEW)
    └── strapi.ts                     # Add revalidate config
```

---

## Task 1: Create SEO Configuration Constants

**Files:**
- Create: `frontend/lib/seo-config.ts`

- [ ] **Step 1: Create SEO config file**

```typescript
// frontend/lib/seo-config.ts

export const SEO_CONFIG = {
  siteName: 'FN Tech',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fn-tech.com',
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh'] as const,
  localesWithRegion: ['en-US', 'zh-CN'] as const,
} as const;

export const SITEMAP_CONFIG = {
  revalidate: 3600, // 1 hour default
  newsRevalidate: 300, // 5 minutes for news
  maxUrlCount: 1000,
} as const;

export const ROBOTS_TXT_CONFIG = {
  allowAll: '*',
  crawlDelays: {
    Googlebot: 1,
    Bingbot: 1,
    Baiduspider: 2,
    YandexBot: 1,
  },
  allowedLLMBots: [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'GoogleExtended',
    'CCBot',
    'Bytespider',
    'AppleBot',
    'Anthropic-AI',
  ],
} as const;

export type Locale = typeof SEO_CONFIG.supportedLocales[number];
```

- [ ] **Step 2: Commit**

```bash
git add frontend/lib/seo-config.ts
git commit -m "feat(seo): add SEO configuration constants"
```

---

## Task 2: Create Structured Data Components

**Files:**
- Create: `frontend/components/seo/StructuredData.tsx`

- [ ] **Step 1: Create structured data components**

```typescript
// frontend/components/seo/StructuredData.tsx

import { SEO_CONFIG } from '@/lib/seo-config';

interface OrganizationData {
  name: string;
  logo?: string;
  url?: string;
  sameAs?: string[];
}

export function OrganizationStructuredData({ data }: { data: OrganizationData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    name: data.name,
    url: data.url || SEO_CONFIG.siteUrl,
    logo: data.logo ? {
      '@type': 'ImageObject',
      url: data.logo,
    } : undefined,
    sameAs: data.sameAs || [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteData {
  name: string;
  description: string;
}

export function WebsiteStructuredData({ data }: { data: WebsiteData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SEO_CONFIG.siteUrl}/#website`,
    name: data.name,
    description: data.description,
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbData {
  items: BreadcrumbItem[];
}

export function BreadcrumbStructuredData({ data }: { data: BreadcrumbData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductData {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  sku?: string;
  price?: string;
  currency?: string;
}

export function ProductStructuredData({ data }: { data: ProductData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
    sku: data.sku,
    offers: data.price ? {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: 'https://schema.org/InStock',
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  publisher?: string;
}

export function ArticleStructuredData({ data }: { data: ArticleData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    author: data.author ? { '@type': 'Person', name: data.author } : undefined,
    publisher: data.publisher ? { '@type': 'Organization', name: data.publisher } : undefined,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQData {
  questions: Array<{ question: string; answer: string }>;
}

export function FAQStructuredData({ data }: { data: FAQData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/seo/StructuredData.tsx
git commit -m "feat(seo): add JSON-LD structured data components"
```

---

## Task 3: Create Geo Meta Tags Component

**Files:**
- Create: `frontend/components/seo/GeoMeta.tsx`

- [ ] **Step 1: Create Geo meta component**

```typescript
// frontend/components/seo/GeoMeta.tsx

interface GeoMetaProps {
  placename?: string;
  position?: string; // latitude, longitude
  region?: string;
  icbm?: string; // latitude, longitude for ICBM meta tag
}

export default function GeoMeta({
  placename,
  position,
  region,
  icbm,
}: GeoMetaProps) {
  return (
    <>
      {placename && <meta name="geo.placename" content={placename} />}
      {region && <meta name="geo.region" content={region} />}
      {position && <meta name="geo.position" content={position} />}
      {icbm && <meta name="ICBM" content={icbm} />}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/components/seo/GeoMeta.tsx
git commit -m "feat(seo): add geo meta tags component"
```

---

## Task 4: Create Dynamic Robots.txt

**Files:**
- Create: `frontend/app/robots.ts`

- [ ] **Step 1: Create dynamic robots.txt**

```typescript
// frontend/app/robots.ts

import { MetadataRoute } from 'next';
import { SEO_CONFIG, ROBOTS_TXT_CONFIG } from '@/lib/seo-config';

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: ROBOTS_TXT_CONFIG.allowAll,
      allow: '/',
    },
  ];

  // Add crawl delay for specific bots
  Object.entries(ROBOTS_TXT_CONFIG.crawlDelays).forEach(([bot, delay]) => {
    rules.push({
      userAgent: bot,
      allow: '/',
      crawlDelay: delay,
    });
  });

  // Add LLM bots
  ROBOTS_TXT_CONFIG.allowedLLMBots.forEach((bot) => {
    rules.push({
      userAgent: bot,
      allow: '/',
    });
  });

  const sitemapUrls = [
    `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  ];

  // Add locale-specific sitemaps
  SEO_CONFIG.supportedLocales.forEach((locale) => {
    sitemapUrls.push(`${SEO_CONFIG.siteUrl}/sitemap-${locale}.xml`);
  });

  return {
    rules,
    sitemap: sitemapUrls,
  };
}
```

- [ ] **Step 2: Delete static robots.txt**

```bash
rm -f frontend/public/robots.txt
git add -A
git commit -m "chore(seo): replace static robots.txt with dynamic generation"
```

---

## Task 5: Create Sitemap Generators

**Files:**
- Create: `frontend/app/sitemap.ts` (main index)
- Create: `frontend/app/sitemap-products.ts`
- Create: `frontend/app/sitemap-applications.ts`
- Create: `frontend/app/sitemap-news.ts`
- Create: `frontend/app/sitemap-others.ts`

- [ ] **Step 1: Create main sitemap index**

```typescript
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
```

- [ ] **Step 2: Create products sitemap**

```typescript
// frontend/app/sitemap-products.ts

import { MetadataRoute } from 'next';
import { getProducts, getProductCategories } from '@/lib/strapi';
import { SEO_CONFIG } from '@/lib/seo-config';

function alternates(url: string, locale: string) {
  return SEO_CONFIG.supportedLocales.map((loc) => ({
    url: `${SEO_CONFIG.siteUrl}/${loc}${url}`,
    locale: loc,
  }));
}

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
```

- [ ] **Step 3: Create applications sitemap**

```typescript
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
```

- [ ] **Step 4: Create news sitemap**

```typescript
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
```

- [ ] **Step 5: Create static pages sitemap**

```typescript
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
```

- [ ] **Step 6: Commit all sitemap files**

```bash
git add frontend/app/sitemap.ts frontend/app/sitemap-products.ts frontend/app/sitemap-applications.ts frontend/app/sitemap-news.ts frontend/app/sitemap-others.ts
git commit -m "feat(seo): add multi-language sitemap generators with ISR"
```

---

## Task 6: Upgrade MetaTags Component

**Files:**
- Modify: `frontend/components/seo/MetaTags.tsx`

- [ ] **Step 1: Read current MetaTags component**

```bash
cat frontend/components/seo/MetaTags.tsx
```

- [ ] **Step 2: Upgrade MetaTags with enhanced features**

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/seo/MetaTags.tsx
git commit -m "feat(seo): upgrade MetaTags with Twitter Cards, Dublin Core, article OG"
```

---

## Task 7: Update JsonLd Component

**Files:**
- Modify: `frontend/components/seo/JsonLd.tsx`

- [ ] **Step 1: Read current JsonLd component**

```bash
cat frontend/components/seo/JsonLd.tsx
```

- [ ] **Step 2: Update JsonLd to use new StructuredData components**

```typescript
// frontend/components/seo/JsonLd.tsx

'use client';

import { OrganizationStructuredData, WebsiteStructuredData } from './StructuredData';

interface JsonLdProps {
  type: 'organization' | 'website';
  data: Record<string, unknown>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  if (type === 'organization') {
    return <OrganizationStructuredData data={data as Parameters<typeof OrganizationStructuredData>[0]['data']} />;
  }

  if (type === 'website') {
    return <WebsiteStructuredData data={data as Parameters<typeof WebsiteStructuredData>[0]['data']} />;
  }

  return null;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/components/seo/JsonLd.tsx
git commit -m "refactor(seo): update JsonLd to use StructuredData components"
```

---

## Task 8: Update Strapi ISR Configuration

**Files:**
- Modify: `frontend/lib/strapi.ts`

- [ ] **Step 1: Add revalidate config to strapi.ts**

Find the `fetchApi` function and add ISR revalidate options:

```typescript
// Add to FetchOptions interface
interface FetchOptions {
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[]; tags?: string[] };
}

// Add content-type specific revalidate times
export const REVALIDATE_TIMES = {
  products: 3600,      // 1 hour
  applications: 3600,   // 1 hour
  news: 300,           // 5 minutes
  about: 86400,        // 24 hours
  faq: 3600,           // 1 hour
  default: 3600,        // 1 hour default
} as const;
```

- [ ] **Step 2: Update fetch calls to use appropriate revalidate times**

In `getProducts`:
```typescript
export async function getProducts(locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>('/api/products', { 
    locale,
  }, { next: { revalidate: REVALIDATE_TIMES.products } });
  // ...
}
```

Apply similar revalidate times to:
- `getApplications` → 3600
- `getPublishedNews` → 300
- `getAboutPageBySlug` → 86400
- `getFAQArticles` → 3600

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/strapi.ts
git commit -m "feat(performance): add ISR revalidate times to strapi fetches"
```

---

## Task 9: Update Layout with Enhanced Metadata

**Files:**
- Modify: `frontend/app/[locale]/layout.tsx`

- [ ] **Step 1: Enhance generateMetadata function**

```typescript
import { SEO_CONFIG } from '@/lib/seo-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const alternates: Record<string, string> = {};
  
  SEO_CONFIG.supportedLocales.forEach((loc) => {
    alternates[loc] = `${SEO_CONFIG.siteUrl}/${loc}`;
  });
  alternates['x-default'] = SEO_CONFIG.siteUrl;

  return {
    metadataBase: new URL(SEO_CONFIG.siteUrl),
    title: {
      default: SEO_CONFIG.siteName,
      template: `%s | ${SEO_CONFIG.siteName}`,
    },
    description: 'FN Tech - Industrial RFID Hardware Solutions Provider',
    keywords: ['RFID', 'industrial RFID', 'RFID reader', 'RFID tag', 'IoT'],
    authors: [{ name: 'FN Tech' }],
    creator: 'FN Tech',
    publisher: 'FN Tech',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: `${SEO_CONFIG.siteUrl}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      siteName: SEO_CONFIG.siteName,
      title: SEO_CONFIG.siteName,
      description: 'FN Tech - Industrial RFID Hardware Solutions Provider',
      url: `${SEO_CONFIG.siteUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@fntech',
      creator: '@fntech',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/[locale]/layout.tsx
git commit -m "feat(seo): enhance layout metadata with full SEO support"
```

---

## Verification Checklist

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Locale-specific sitemaps work at `/{locale}/sitemap-products-{locale}.xml`
- [ ] robots.txt accessible at `/robots.txt`
- [ ] All LLM bots allowed in robots.txt
- [ ] hreflang tags present in page `<head>`
- [ ] JSON-LD structured data renders correctly
- [ ] Twitter Card meta tags present
- [ ] Dublin Core meta tags present
- [ ] ISR revalidation configured for all content types
- [ ] No TypeScript errors (`npx tsc --noEmit`)

---

## Self-Review Checklist

- [ ] All spec requirements covered by tasks
- [ ] No placeholder code (TBD, TODO)
- [ ] Type consistency across all components
- [ ] File paths are correct
- [ ] ISR revalidate times match spec
- [ ] All SEO components properly typed
