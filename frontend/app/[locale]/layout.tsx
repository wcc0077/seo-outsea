import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { getGlobal, getStrapiImageUrl } from '@/lib/strapi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocaleSetter from '@/components/LocaleSetter';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

const NAV_LINKS: Record<string, NavItem[]> = {
  en: [
    {
      label: 'Products',
      href: '/products',
      children: [
        { label: 'HF RFID Readers', href: '/products/category/hf-rfid-readers' },
        { label: 'UHF RFID Readers', href: '/products/category/uhf-rfid-readers' },
        { label: 'Handheld Terminals', href: '/products/category/handheld-terminals' },
        { label: 'Industrial Tablets', href: '/products/category/industrial-tablets' },
        { label: 'Portable Readers', href: '/products/category/portable-readers' },
      ],
    },
    {
      label: 'Applications',
      href: '/applications',
      children: [
        { label: 'Smart Manufacturing', href: '/applications' },
        { label: 'Warehouse & Logistics', href: '/applications' },
        { label: 'Archive & Library', href: '/applications' },
        { label: 'Asset Management', href: '/applications' },
        { label: 'Anti-counterfeit & Traceability', href: '/applications' },
        { label: 'Retail & Supply Chain', href: '/applications' },
        { label: 'Smart City', href: '/applications' },
        { label: 'Smart Cabinet', href: '/applications' },
      ],
    },
    {
      label: 'Support',
      href: '/support',
      children: [
        { label: 'Product Support', href: '/products' },
        { label: 'Service Support', href: '/contact' },
        { label: 'FAQ', href: '/sharing' },
        { label: 'Knowledge Base', href: '/sharing' },
      ],
    },
    { label: 'News', href: '/news' },
    {
      label: 'About',
      href: '/about',
      children: [
        { label: 'About FN', href: '/about' },
        { label: 'Company Scene', href: '/about/company' },
        { label: 'History', href: '/about/history' },
        { label: 'Honors & Certs', href: '/about/honors' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ],
  zh: [
    {
      label: '产品',
      href: '/products',
      children: [
        { label: '高频系列RFID读写器', href: '/products/category/hf-rfid-readers' },
        { label: '超高频系列RFID读写器', href: '/products/category/uhf-rfid-readers' },
        { label: '多功能手持终端', href: '/products/category/handheld-terminals' },
        { label: '多功能工业平板', href: '/products/category/industrial-tablets' },
        { label: '便携式RFID读写器', href: '/products/category/portable-readers' },
      ],
    },
    {
      label: '应用',
      href: '/applications',
      children: [
        { label: '智能制造', href: '/applications' },
        { label: '仓储物流', href: '/applications' },
        { label: '档案图书', href: '/applications' },
        { label: '资产管理', href: '/applications' },
        { label: '防伪追溯', href: '/applications' },
        { label: '零售与供应链', href: '/applications' },
        { label: '智慧城市', href: '/applications' },
        { label: '智能柜体', href: '/applications' },
      ],
    },
    {
      label: '技术支持',
      href: '/support',
      children: [
        { label: '产品支持', href: '/products' },
        { label: '服务支持', href: '/contact' },
        { label: '常见问题', href: '/sharing' },
        { label: '知识分享', href: '/sharing' },
      ],
    },
    { label: '新闻', href: '/news' },
    {
      label: '关于',
      href: '/about',
      children: [
        { label: '孚恩简介', href: '/about' },
        { label: '公司实景', href: '/about/company' },
        { label: '发展历程', href: '/about/history' },
        { label: '荣誉资质', href: '/about/honors' },
      ],
    },
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
