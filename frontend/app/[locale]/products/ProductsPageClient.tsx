'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { getStrapiImageUrl, ProductData, ProductCategoryData } from '@/lib/strapi';

interface ProductsPageClientProps {
  products: ProductData[];
  categories: ProductCategoryData[];
  locale: string;
}

// ── Filter dimension definitions ──

const FREQUENCY_OPTIONS = [
  { key: null, label: '不限' },
  { key: 'uhf', label: 'UHF (860~960MHz)' },
  { key: 'hf', label: 'HF (13.56MHz)' },
  { key: 'lf-125khz', label: 'LF (125KHz)' },
  { key: 'lf-134khz', label: 'LF (134.2KHz)' },
  { key: 'vhf', label: 'VHF (2.45GHz)' },
];

const FEATURE_OPTIONS = [
  { key: null, label: '不限' },
  { key: 'barcode-scan', label: '条码扫描' },
  { key: '2d-id', label: '二代证' },
  { key: 'print', label: '打印' },
  { key: 'camera', label: '摄像头' },
  { key: 'gnss', label: 'GNSS定位' },
  { key: 'psam', label: 'PSAM' },
];

const CONNECTIVITY_OPTIONS = [
  { key: null, label: '不限' },
  { key: '4g', label: '4G全网通' },
  { key: 'wifi', label: 'WIFI' },
  { key: 'bluetooth', label: '蓝牙' },
  { key: 'tcp/ip', label: 'TCP/IP' },
  { key: 'rs232', label: 'RS232' },
  { key: 'rs485', label: 'RS485' },
  { key: 'usb', label: 'USB' },
  { key: 'io-link', label: 'IO-Link' },
  { key: 'poe', label: 'POE' },
];

const OS_OPTIONS = [
  { key: null, label: '不限' },
  { key: 'android', label: 'Android' },
  { key: 'windows', label: 'Windows' },
  { key: 'other', label: '其它' },
];

const FILTER_DIMENSIONS = [
  { label: 'RFID识别', options: FREQUENCY_OPTIONS },
  { label: '产品功能', options: FEATURE_OPTIONS },
  { label: '传输方式', options: CONNECTIVITY_OPTIONS },
  { label: '操作系统', options: OS_OPTIONS },
];

export default function ProductsPageClient({ products, categories, locale }: ProductsPageClientProps) {
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

  // Get all leaf category slugs for a top-level category
  const getCategorySlugs = (catSlug: string): string[] => {
    const group = grouped.find(g => g.parent.slug === catSlug);
    if (!group) return [];
    return group.children.map(c => c.slug);
  };

  // Filter products for the main grid (NO search filtering)
  const gridFiltered = useMemo(() => {
    let result = products;

    // Category filter
    if (activeCategory) {
      const slugs = getCategorySlugs(activeCategory);
      result = result.filter(p => p.category?.slug && slugs.includes(p.category.slug));
    }

    // Frequency filter
    if (activeFrequency) {
      result = result.filter(p => p.rfidFrequency === activeFrequency);
    }

    // Feature filter
    if (activeFeature) {
      result = result.filter(p => p.features?.includes(activeFeature));
    }

    // Connectivity filter
    if (activeConnectivity) {
      result = result.filter(p => p.connectivity?.includes(activeConnectivity));
    }

    // OS filter
    if (activeOs) {
      result = result.filter(p => p.os === activeOs);
    }

    return result;
  }, [products, activeCategory, activeFrequency, activeFeature, activeConnectivity, activeOs, getCategorySlugs]);

  // Search-only filtering for the suggestions dropdown
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return gridFiltered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q)
    );
  }, [gridFiltered, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeFrequency, activeFeature, activeConnectivity, activeOs]);

  const totalPages = Math.ceil(gridFiltered.length / pageSize);
  const paginated = gridFiltered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasActiveFilters = activeCategory || activeFrequency || activeFeature || activeConnectivity || activeOs;

  return (
    <div className="py-12 bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page title ── */}
        <div className="mb-8">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
        </div>

        {/* ── Top category tabs ── */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              !activeCategory
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'bg-white text-neutral-700 hover:bg-primary-50 hover:text-primary-600 border border-neutral-200'
            }`}
          >
            全部产品
          </button>
          {grouped.map(group => (
            <button
              key={group.parent.slug}
              onClick={() => setActiveCategory(activeCategory === group.parent.slug ? null : group.parent.slug)}
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

        {/* ── Filter table ── */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-6">
          {FILTER_DIMENSIONS.map((dim, dimIdx) => (
            <div
              key={dim.label}
              className={`flex items-center border-b border-neutral-100 last:border-b-0 ${
                dimIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
              }`}
            >
              {/* Label */}
              <div className="flex-shrink-0 w-24 sm:w-28 px-4 py-3 text-sm font-bold text-neutral-700 bg-neutral-100 border-r border-neutral-200">
                {dim.label}
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-1.5 px-4 py-2.5 flex-1 min-w-0">
                {dim.options.map(opt => {
                  const isActive =
                    (dim.label === 'RFID识别' && activeFrequency === opt.key) ||
                    (dim.label === '产品功能' && activeFeature === opt.key) ||
                    (dim.label === '传输方式' && activeConnectivity === opt.key) ||
                    (dim.label === '操作系统' && activeOs === opt.key);

                  return (
                    <button
                      key={opt.key ?? '__all__'}
                      onClick={() => {
                        if (dim.label === 'RFID识别') setActiveFrequency(isActive ? null : opt.key);
                        else if (dim.label === '产品功能') setActiveFeature(isActive ? null : opt.key);
                        else if (dim.label === '传输方式') setActiveConnectivity(isActive ? null : opt.key);
                        else if (dim.label === '操作系统') setActiveOs(isActive ? null : opt.key);
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Search bar + results count ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索产品名称、描述..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => {}}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            />
            {/* ─ Search suggestions dropdown ── */}
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
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                      {product.category && (
                        <p className="text-xs text-neutral-500 truncate">{product.category.name}</p>
                      )}
                    </div>
                  </Link>
                ))}
                {searchFiltered.length > 8 && (
                  <div className="px-4 py-2.5 text-xs text-neutral-400 text-center border-t border-neutral-100">
                    还有 {searchFiltered.length - 8} 个匹配结果 · 按回车查看全部
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">
              找到 <span className="font-semibold text-neutral-900">{gridFiltered.length}</span> 个产品
            </span>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveFrequency(null);
                  setActiveFeature(null);
                  setActiveConnectivity(null);
                  setActiveOs(null);
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-xs text-primary-600 hover:text-primary-500 font-medium underline"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>

        {/* ── Product Grid ── */}
        {gridFiltered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map(product => (
              <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-200 bg-white">
                  {/* Image area */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-[4/3]">
                    {(product.images?.[0] || product.imageUrl) ? (
                      <>
                        <img
                          src={product.imageUrl || getStrapiImageUrl(product.images?.[0]?.url) || '/placeholder.png'}
                          alt={product.images?.[0]?.alternativeText || product.name}
                          className="w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-300">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Category badge overlay */}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-700 shadow-sm">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Quick specs */}
                    <div className="flex flex-wrap gap-1.5">
                      {product.rfidFrequency && (
                        <span className="px-2 py-0.5 rounded text-xs bg-cyan-50 text-cyan-700 font-medium">
                          {FREQUENCY_OPTIONS.find(o => o.key === product.rfidFrequency)?.label || product.rfidFrequency}
                        </span>
                      )}
                      {product.os && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 font-medium">
                          {OS_OPTIONS.find(o => o.key === product.os)?.label || product.os}
                        </span>
                      )}
                      {product.connectivity?.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-600 font-medium">
                          {CONNECTIVITY_OPTIONS.find(o => o.key === c)?.label || c}
                        </span>
                      ))}
                      {product.features?.slice(0, 2).map(f => (
                        <span key={f} className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 font-medium">
                          {FEATURE_OPTIONS.find(o => o.key === f)?.label || f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            </div>

            {/* ─ Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3.5 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all text-neutral-700"
                  >
                    ‹ 上一页
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
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
                    className="px-3.5 py-2 text-sm font-medium border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all text-neutral-700"
                  >
                    下一页 ›
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-500 text-lg">没有找到匹配的产品</p>
            <button
              onClick={() => {
                setActiveCategory(null);
                setActiveFrequency(null);
                setActiveFeature(null);
                setActiveConnectivity(null);
                setActiveOs(null);
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              清除所有筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
