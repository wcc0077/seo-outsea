import Link from 'next/link';
import { getFAQArticles, FAQArticleData } from '@/lib/strapi';

const CATEGORY_LABELS: Record<string, string> = {
  faq: '常见问题',
  technical: '技术原理',
  application: '行业应用',
  guide: '选购指南',
};

const CATEGORY_COLORS: Record<string, string> = {
  faq: 'bg-blue-100 text-blue-700',
  technical: 'bg-purple-100 text-purple-700',
  application: 'bg-green-100 text-green-700',
  guide: 'bg-orange-100 text-orange-700',
};

export default async function SharingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const articles = await getFAQArticles(locale).catch(() => []);

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
          <h1 className="text-4xl font-bold mb-5">知识分享</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
            深入了解RFID技术原理、行业应用场景和产品选型指南。
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
              <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-neutral-500">暂无文章，敬请期待。</p>
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article, locale }: { article: FAQArticleData; locale: string }) {
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const categoryColor = CATEGORY_COLORS[article.category] || 'bg-neutral-100 text-neutral-700';

  // Extract a short preview from the content
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
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
              {categoryLabel}
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
          <div className="mt-3 flex items-center gap-1 text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            阅读全文
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
