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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSetter locale={locale} />
      <HeaderWrapper {...headerProps} />
      <main className="flex-1">{children}</main>
      <Footer global={globalData} locale={locale} currentYear={currentYear} />
    </NextIntlClientProvider>
  );
}
