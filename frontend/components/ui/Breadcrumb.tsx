'use client';

import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
}

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
  const allItems = [{ label: locale === 'zh' ? '首页' : 'Home', href: `/${locale}` }, ...items];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fn-tech.com'}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href={`/${locale}`} className="text-neutral-400 hover:text-primary-400 transition-colors">
              {allItems[0].label}
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neutral-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {item.href ? (
                <Link href={item.href} className="text-neutral-400 hover:text-primary-400 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-300" aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}