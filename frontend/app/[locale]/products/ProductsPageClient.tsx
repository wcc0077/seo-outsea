'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { getStrapiImageUrl, ProductData, ProductCategoryData } from '@/lib/strapi';

interface ProductsPageClientProps {
  products: ProductData[];
  categories: ProductCategoryData[];
  locale: string;
}

const FREQUENCY_KEYS = [null, 'uhf', 'hf', 'lf-125khz', 'lf-134khz', 'vhf'] as const;
const FEATURE_KEYS = [null, 'barcode-scan', '2d-id', 'print', 'camera', 'gnss', 'psam'] as const;
const CONNECTIVITY_KEYS = [null, '4g', 'wifi', 'bluetooth', 'tcp/ip', 'rs232', 'rs485', 'usb', 'io-link', 'poe'] as const;
const OS_KEYS = [null, 'android', 'windows', 'other'] as const;

const FREQUENCY_LABELS: Record<string, string> = {
  uhf: 'UHF (860~960MHz)',
  hf: 'HF (13.56MHz)',
  'lf-125khz': 'LF (125KHz)',
  'lf-134khz': 'LF (134.2KHz)',
  vhf: 'VHF (2.45GHz)',
};

const FEATURE_I18N_KEYS: Record<string, string> = {
  'barcode-scan': 'barcodeScan',
  '2d-id': 'idCard',
  print: 'print',
  camera: 'camera',
  gnss: 'gnss',
  psam: 'psam',
};

const CONNECTIVITY_I18N_KEYS: Record<string, string> = {
  '4g': '4g',
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  'tcp/ip': 'tcpIp',
  rs232: 'rs232',
  rs485: 'rs485',
  usb: 'usb',
  'io-link': 'ioLink',
  poe: 'poe',
};

const OS_I18N_KEYS: Record<string, string> = {
  android: 'android',
  windows: 'windows',
  other: 'other',
};

export default function ProductsPageClient({ products, categories, locale }: ProductsPageClientProps) {
  const t = useTranslations('ProductsPage');
  const tc = useTranslations('Common');

  const FILTER_DIMENSIONS = [
    { label: t('frequency'), keys: FREQUENCY_KEYS, i18nKeys: FREQUENCY_LABELS, type: 'frequency' as const },
    { label: t('feature'), keys: FEATURE_KEYS, i18nKeys: FEATURE_I18N_KEYS, type: 'feature' as const },
    { label: t('connectivity'), keys: CONNECTIVITY_KEYS, i18nKeys: CONNECTIVITY_I18N_KEYS, type: 'connectivity' as const },
    { label: t('os'), keys: OS_KEYS, i18nKeys: OS_I18N_KEYS, type: 'os' as const },
  ];

  const getOptionLabel = (dim: typeof FILTER_DIMENSIONS[number], key: string | null): string => {
    if (key === null) return t('all');
    if (dim.type === 'frequency') return FREQUENCY_LABELS[key] || key;
    const i18nKey = dim.i18nKeys[key];
    return i18nKey ? t(i18nKey as Parameters<typeof t>[0]) : key;
  };

  // Group categories by parent for top-level tabs
  const grouped = categories.reduce<Array<{ parent: ProductCategoryData; children: ProductCategoryData[] }>>((acc, cat) => {
    if (!cat.parent) {
      if (!acc.find(g => g.parent.slug === cat.slug)) {
        acc.push({ parent: cat, children: cat.children || [] });
      }
    }
    return acc;
  }, []);
  grouped.sort((a, b) => (a.parent.sortOrder || 0) - (b.parent.sortOrder || 0));

  // State
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFrequency, setActiveFrequency] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeConnectivity, setActiveConnectivity] = useState<string | null>(null);
  const [activeOs, setActiveOs] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const getCategorySlugs = (catSlug: string): string[] => {
    const group = grouped.find(g => g.parent.slug === catSlug);
    if (!group) return [];
    return group.children.map(c => c.slug);
  };

  const gridFiltered = useMemo(() => {
    let result = products;
    if (activeCategory) {
      const slugs = getCategorySlugs(activeCategory);
      result = result.filter(p => p.category?.slug && slugs.includes(p.category.slug));
    }
    if (activeFrequency) result = result.filter(p => p.rfidFrequency === activeFrequency);
    if (activeFeature) result = result.filter(p => p.features?.includes(activeFeature));
    if (activeConnectivity) result = result.filter(p => p.connectivity?.includes(activeConnectivity));
    if (activeOs) result = result.filter(p => p.os === activeOs);
    return result;
  }, [products, activeCategory, activeFrequency, activeFeature, activeConnectivity, activeOs, getCategorySlugs]);

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return gridFiltered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q)
    );
  }, [gridFiltered, searchQuery]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, activeFrequency, activeFeature, activeConnectivity, activeOs]);

  const totalPages = Math.ceil(gridFiltered.length / pageSize);
  const paginated = gridFiltered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasActiveFilters = activeCategory || activeFrequency || activeFeature || activeConnectivity || activeOs;

  const clearAllFilters = () => {
    setActiveCategory(null);
    setActiveFrequency(null);
    setActiveFeature(null);
    setActiveConnectivity(null);
    setActiveOs(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="py-12 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-3xl font-bold text-neutral-900">{t('title')}</h1>
        </div>

        {/* Top category tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            aria-pressed={!activeCategory}
            className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              !activeCategory
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
            }`}
          >
            {t('title')}
          </button>
          {grouped.map(group => (
            <button
              key={group.parent.slug}
              onClick={() => setActiveCategory(activeCategory === group.parent.slug ? null : group.parent.slug)}
              aria-pressed={activeCategory === group.parent.slug}
              className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeCategory === group.parent.slug
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
              }`}
            >
              {group.parent.name}
            </button>
          ))}
        </div>

        {/* Filter table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
          {FILTER_DIMENSIONS.map((dim, dimIdx) => (
            <div
              key={dim.type}
              className={`flex items-center border-b border-neutral-100 last:border-b-0 ${
                dimIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
              }`}
            >
              <div className="flex-shrink-0 w-24 sm:w-28 px-4 py-3 text-sm font-bold text-neutral-700 bg-neutral-100 border-r border-neutral-200">
                {dim.label}
              </div>
              <div className="flex flex-wrap gap-1.5 px-4 py-2.5 flex-1 min-w-0">
                {dim.keys.map(key => {
                  const isActive =
                    (dim.type === 'frequency' && activeFrequency === key) ||
                    (dim.type === 'feature' && activeFeature === key) ||
                    (dim.type === 'connectivity' && activeConnectivity === key) ||
                    (dim.type === 'os' && activeOs === key);

                  return (
                    <button
                      key={key ?? '__all__'}
                      onClick={() => {
                        if (dim.type === 'frequency') setActiveFrequency(isActive ? null : key);
                        else if (dim.type === 'feature') setActiveFeature(isActive ? null : key);
                        else if (dim.type === 'connectivity') setActiveConnectivity(isActive ? null : key);
                        else if (dim.type === 'os') setActiveOs(isActive ? null : key);
                      }}
                      aria-pressed={isActive}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {getOptionLabel(dim, key)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Search bar + results count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('title') + '...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
            {searchQuery.trim().length > 0 && searchFiltered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-200 shadow-xl z-50 max-h-80 overflow-y-auto">
                {searchFiltered.slice(0, 8).map(product => (
                  <Link
                    key={product.slug}
                    href={`/${locale}/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      ) : (
                        <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                      {product.category && <p className="text-xs text-neutral-500 truncate">{product.category.name}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              {t('found', { count: gridFiltered.length })}
            </span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-primary-600 hover:text-primary-500 font-medium underline">
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {gridFiltered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map(product => (
              <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-200 bg-white">
                  <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-[4/3]">
                    {(product.images?.[0] || product.imageUrl) ? (
                      <>
                        <Image
                          src={product.imageUrl || getStrapiImageUrl(product.images?.[0]?.url) || '/placeholder.png'}
                          alt={product.images?.[0]?.alternativeText || product.name}
                          fill
                          className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-300">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-700 shadow-sm">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.rfidFrequency && (
                        <span className="px-2 py-0.5 rounded text-xs bg-cyan-50 text-cyan-700 font-medium">
                          {FREQUENCY_LABELS[product.rfidFrequency] || product.rfidFrequency}
                        </span>
                      )}
                      {product.os && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 font-medium">
                          {OS_I18N_KEYS[product.os] ? t(OS_I18N_KEYS[product.os] as Parameters<typeof t>[0]) : product.os}
                        </span>
                      )}
                      {product.connectivity?.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-600 font-medium">
                          {CONNECTIVITY_I18N_KEYS[c] ? t(CONNECTIVITY_I18N_KEYS[c] as Parameters<typeof t>[0]) : c}
                        </span>
                      ))}
                      {product.features?.slice(0, 2).map(f => (
                        <span key={f} className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 font-medium">
                          {FEATURE_I18N_KEYS[f] ? t(FEATURE_I18N_KEYS[f] as Parameters<typeof t>[0]) : f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    aria-label={tc('previous')}
                    className="px-3.5 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all text-neutral-700"
                  >
                    ‹ {tc('previous')}
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Page ${page}`}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all ${
                      page === currentPage
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                        : 'border border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    aria-label={tc('next')}
                    className="px-3.5 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all text-neutral-700"
                  >
                    {tc('next')} ›
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-500 text-lg">{t('noResults')}</p>
            <button onClick={clearAllFilters} className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium">
              {t('clearAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}