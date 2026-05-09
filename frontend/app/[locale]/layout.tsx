import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import { getGlobal, getStrapiImageUrl } from '@/lib/strapi';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import LocaleSetter from '@/components/LocaleSetter';
import { getNavLinks } from '@/lib/nav-links';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Metadata {
  const locale = params.then(p => p.locale);
  const alternates: Record<string, string> = {};

  for (const loc of SUPPORTED_LOCALES) {
    alternates[loc] = `${SITE_URL}/${loc}`;
  }

  return {
    alternates: {
      languages: alternates,
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
  const globalData = await getGlobal().catch(() => null);
  const navLinks = await getNavLinks(locale);

  const headerProps = {
    siteName: globalData?.siteName || 'FN Tech',
    logoUrl: globalData ? getStrapiImageUrl(globalData?.['logo']?.url) : null,
    navLinks,
    locale,
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
