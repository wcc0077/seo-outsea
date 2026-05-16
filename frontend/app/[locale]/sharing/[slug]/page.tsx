import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFAQArticleBySlug, getFAQArticles } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface FAQArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function FAQArticleDetailPage({ params }: FAQArticleDetailPageProps) {
  const { locale, slug } = await params;
  const article = await getFAQArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'SharingPage' });
  const relatedArticles = await getFAQArticles(locale).catch(() => []);

  const categoryLabel = (cat: string) => {
    try { return t(`categories.${cat}`); } catch { return cat; }
  };

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb locale={locale} items={[
          { label: t('title'), href: `/${locale}/sharing` },
          { label: article.title },
        ]} />

        <article className="mt-8">
          <div className="mb-6">
            {article.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-4">
                {categoryLabel(article.category)}
              </span>
            )}
            <h1 className="text-3xl font-bold text-neutral-900">{article.title}</h1>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </article>

        {relatedArticles.length > 1 && (
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles
                .filter((a) => a.slug !== article.slug)
                .slice(0, 3)
                .map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${locale}/sharing/${related.slug}`}
                    className="p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    {related.category && (
                      <span className="text-xs text-primary-600 font-medium">{categoryLabel(related.category)}</span>
                    )}
                    <h3 className="font-medium text-neutral-900 mt-1 line-clamp-2">{related.title}</h3>
                  </Link>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link
            href={`/${locale}/sharing`}
            className="text-primary-600 hover:text-primary-500 font-medium text-sm"
          >
            ← {t('backToList')}
          </Link>
        </div>
      </div>
    </div>
  );
}