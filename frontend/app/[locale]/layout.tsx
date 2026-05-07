import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { getGlobal, getStrapiImageUrl } from '@/lib/strapi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocaleSetter from '@/components/LocaleSetter';

const NAV_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  en: [
    { label: 'Products', href: '/products' },
    { label: 'Applications', href: '/applications' },
    { label: 'Support', href: '/support' },
    { label: 'News', href: '/news' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  zh: [
    { label: '产品', href: '/products' },
    { label: '应用', href: '/applications' },
    { label: '技术支持', href: '/support' },
    { label: '新闻', href: '/news' },
    { label: '关于', href: '/about' },
    { label: '联系', href: '/contact' },
  ],
};

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

  const headerProps = {
    siteName: globalData?.siteName || 'FN Tech',
    logoUrl: globalData ? getStrapiImageUrl(globalData?.['logo']?.url) : null,
    navLinks: NAV_LINKS[locale] || NAV_LINKS.en,
    locale,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSetter locale={locale} />
      <Header {...headerProps} />
      <main className="flex-1">{children}</main>
      <Footer global={globalData} locale={locale} />
    </NextIntlClientProvider>
  );
}
