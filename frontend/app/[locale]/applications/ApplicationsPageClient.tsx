'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getStrapiImageUrl, ApplicationData, ApplicationCategoryData } from '@/lib/strapi';

interface ApplicationsPageClientProps {
  applications: ApplicationData[];
  categories: ApplicationCategoryData[];
  locale: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  factory: '🏭',
  warehouse: '📦',
  book: '📚',
  shield: '🛡️',
  'check-shield': '✅',
  cart: '🛒',
  city: '🏙️',
  grid: '🗄️',
};

// Gradient backgrounds per category for visual richness when no image
const CATEGORY_GRADIENTS: Record<string, string> = {
  factory: 'from-blue-900 via-indigo-800 to-slate-900',
  warehouse: 'from-emerald-900 via-teal-800 to-cyan-900',
  book: 'from-amber-900 via-orange-800 to-red-900',
  shield: 'from-slate-800 via-gray-700 to-zinc-800',
  'check-shield': 'from-green-900 via-emerald-800 to-teal-900',
  cart: 'from-rose-900 via-pink-800 to-fuchsia-900',
  city: 'from-violet-900 via-purple-800 to-indigo-900',
  grid: 'from-cyan-900 via-blue-800 to-indigo-900',
};

const PAGE_SIZE = 8;

export default function ApplicationsPageClient({ applications, categories, locale }: ApplicationsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filtered = useMemo(() => {
    if (!activeCategory) return applications;
    return applications.filter(a => a.category?.slug === activeCategory);
  }, [applications, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const gradientKey = (slug: string | undefined) => CATEGORY_GRADIENTS[slug || ''] || 'from-neutral-700 via-neutral-600 to-neutral-700';

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* ── Page header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(147,51,234,0.3) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="w-12 h-0.5 bg-primary-500 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Applications</h1>
          <p className="text-lg text-neutral-300 max-w-2xl">
            RFID技术在各行各业的深度应用，从智能制造到智慧城市，为您提供完整的行业解决方案。
          </p>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !activeCategory
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-600'
              }`}
            >
              全部方案
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={`flex-shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === cat.slug
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-600'
                }`}
              >
                <span className="text-base">{CATEGORY_ICONS[cat.icon] || '📋'}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-sm text-neutral-500">
          {activeCategory
            ? `${categories.find(c => c.slug === activeCategory)?.name || ''} · `
            : ''}
          共 <span className="font-semibold text-neutral-900">{filtered.length}</span> 个应用方案
        </p>
      </div>

      {/* ── Application showcase ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {paginated.length > 0 ? (
          <>
            <div className="space-y-16">
              {paginated.map((app, idx) => {
                const catIcon = app.category?.icon || '';
                const catSlug = app.category?.slug || '';
                const grad = gradientKey(catSlug);
                const icon = CATEGORY_ICONS[catIcon] || '📋';

                return (
                  <Link
                    key={app.slug}
                    href={`/${locale}/applications/${app.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:border-primary-300 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image / visual section */}
                      <div className={`lg:w-2/5 relative overflow-hidden bg-gradient-to-br ${grad} min-h-[280px]`}>
                        {app.images?.[0] ? (
                          <img
                            src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
                            alt={app.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-7xl mb-3 block drop-shadow-lg">{icon}</span>
                              <p className="text-sm text-white/70 font-medium">{app.category?.name || '应用场景'}</p>
                            </div>
                          </div>
                        )}
                        {/* Decorative overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content section */}
                      <div className="lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        {app.category && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-600 border border-primary-100">
                              {icon} {app.category.name}
                            </span>
                          </div>
                        )}

                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                          {app.name}
                        </h3>

                        <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-3">
                          {app.description}
                        </p>

                        <div className="flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:gap-3 transition-all">
                          <span>了解详情</span>
                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* ── Pagination ── */}
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
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-neutral-500 text-lg">该分类下暂无应用方案</p>
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              查看全部方案
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
