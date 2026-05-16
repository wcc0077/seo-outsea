import Link from 'next/link';
import { getFAQArticles, FAQArticleData } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';

const CATEGORY_COLORS: Record<string, string> = {
  faq: 'bg-blue-100 text-blue-700',
  technical: 'bg-purple-100 text-purple-700',
  application: 'bg-green-100 text-green-700',
  guide: 'bg-orange-100 text-orange-700',
};

export default async function SharingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SharingPage' });

  const articles = await getFAQArticles(locale).catch(() => []);

  const categoryLabel = (cat: string) => {
    try { return t(`categories.${cat}`); } catch { return cat; }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-primary-500/10" />
            <div className="absolute inset-12 rounded-full border border-primary-500/8" />
            <div className="absolute inset-24 rounded-full border border-primary-500/5" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-5">{t('title')}</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mt-8" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Article List */}
      <section className="py-16 bg-white" data-locale={locale}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-neutral-500">—</p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} locale={locale} categoryLabel={categoryLabel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article, locale, categoryLabel }: { article: FAQArticleData; locale: string; categoryLabel: (cat: string) => string }) {
  const categoryColor = CATEGORY_COLORS[article.category] || 'bg-neutral-100 text-neutral-700';
  const preview = article.content
    .replace(/[#*`_\-~]/g, '')
    .trim()
    .slice(0, 150);

  return (
    <Link
      href={`/${locale}/sharing/${article.slug}`}
      className="group block rounded-2xl p-6 bg-white border border-neutral-200 hover:border-primary-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
              {categoryLabel(article.category)}
            </span>
            {article.publishDate && (
              <span className="text-xs text-neutral-400">{article.publishDate}</span>
            )}
          </div>
          <h3 className="font-semibold text-lg text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {preview}...
          </p>
        </div>
      </div>
    </Link>
  );
}