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
