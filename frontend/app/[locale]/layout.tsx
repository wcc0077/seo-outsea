import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import { SEO_CONFIG } from '@/lib/seo-config';
import { getGlobal, getStrapiImageUrl, getProductCategories, getProducts, getApplicationCategories, getRfidTags } from '@/lib/strapi';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import LocaleSetter from '@/components/LocaleSetter';
import { getNavLinks } from '@/lib/nav-links';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Locale to OpenGraph locale mapping
const LOCALE_TO_OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  fr: 'fr_FR',
  de: 'de_DE',
  es: 'es_ES',
  ru: 'ru_RU',
};

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
      locale: LOCALE_TO_OG_LOCALE[locale] || 'en_US',
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

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const [globalData, productCategories, products, appCategories, rfidTags] = await Promise.all([
    getGlobal().catch(() => null),
    getProductCategories(locale).catch(() => []),
    getProducts(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
    getRfidTags(locale).catch(() => []),
  ]);
  const navLinks = await getNavLinks(locale);

  const headerProps = {
    siteName: globalData?.siteName || 'FN Tech',
    logoUrl: globalData ? getStrapiImageUrl(globalData?.['logo']?.url) : null,
    navLinks,
    locale,
    productCategories,
    products,
    appCategories,
    rfidTags,
  };

  const currentYear = new Date().getFullYear();

  // JSON-LD Structured Data for Organization and WebSite
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    name: 'FN Tech',
    url: SEO_CONFIG.siteUrl,
    logo: globalData?.logo?.url ? getStrapiImageUrl(globalData.logo.url) : undefined,
    sameAs: [
      'https://www.linkedin.com/company/fn-tech',
      'https://twitter.com/fntech',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'National 863 Software Incubator Base, Caohejing Pujiang Hi-Tech Park',
        addressLocality: 'Shanghai',
        addressRegion: 'Shanghai',
        addressCountry: 'CN',
      },
      areaServed: 'Worldwide',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SEO_CONFIG.siteUrl}/#website`,
    name: 'FN Tech',
    description: 'Industrial RFID Hardware Solutions Provider',
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/${locale}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSetter locale={locale} />
      {/* JSON-LD Structured Data - rendered in body, valid per Google guidelines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeaderWrapper {...headerProps} />
      <main className="flex-1">{children}</main>
      <Footer global={globalData} locale={locale} currentYear={currentYear} />
    </NextIntlClientProvider>
  );
}
