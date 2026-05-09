import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFAQArticleBySlug, getFAQArticles, FAQArticleData } from '@/lib/strapi';
import Breadcrumb from '@/components/ui/Breadcrumb';

const CATEGORY_LABELS: Record<string, string> = {
  faq: '常见问题',
  technical: '技术原理',
  application: '行业应用',
  guide: '选购指南',
};

export default async function FAQArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  const article = await getFAQArticleBySlug(slug, locale);
  if (!article) {
    notFound();
  }

  // Get related articles (same category, excluding current)
  const allArticles = await getFAQArticles(locale).catch(() => []);
  const related = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb locale={locale} items={[
          { label: locale === 'zh' ? '技术支持' : 'Support', href: `/${locale}/support` },
          { label: locale === 'zh' ? '知识分享' : 'Knowledge Base', href: `/${locale}/sharing` },
          { label: article.title },
        ]} />

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
              {categoryLabel}
            </span>
            {article.publishDate && (
              <span className="text-sm text-neutral-400">{article.publishDate}</span>
            )}
            {article.author && (
              <span className="text-sm text-neutral-400">{article.author}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 leading-tight">{article.title}</h1>
        </header>

        {/* Article Content */}
        <article className="prose prose-neutral max-w-none mb-12">
          {article.content.split('\n').map((line, i) => {
            if (line.startsWith('### ')) {
              return <h3 key={i} className="text-xl font-semibold text-neutral-900 mt-8 mb-4">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-2xl font-bold text-neutral-900 mt-10 mb-5">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('| ')) {
              // Skip markdown table rows - render as simple text for now
              return <div key={i} className="text-sm font-mono bg-neutral-50 rounded px-3 py-1.5 my-0.5">{line}</div>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="text-neutral-700 ml-4 list-disc">{line.replace('- ', '')}</li>;
            }
            if (/^\d+\.\s/.test(line)) {
              const content = line.replace(/^\d+\.\s/, '');
              return <li key={i} className="text-neutral-700 ml-4 list-decimal">{content}</li>;
            }
            if (line.trim() === '') {
              return <div key={i} className="h-3" />;
            }
            return <p key={i} className="text-neutral-700 leading-relaxed">{line}</p>;
          })}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="border-t border-neutral-200 pt-10">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">相关文章</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${locale}/sharing/${rel.slug}`}
                  className="block rounded-xl p-4 bg-neutral-50 border border-neutral-200 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <span className="text-xs font-medium bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[rel.category] || rel.category}
                  </span>
                  <h4 className="font-medium text-neutral-900 mt-2 text-sm line-clamp-2">{rel.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to list */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/sharing`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            返回知识分享
          </Link>
        </div>
      </div>
    </div>
  );
}
