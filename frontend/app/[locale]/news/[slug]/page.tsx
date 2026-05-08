import { notFound } from 'next/navigation';
import { getNewsBySlug, NewsData } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug, locale);

  if (!news) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="py-20">
      <Breadcrumb locale={locale} items={[
        { label: locale === 'zh' ? '新闻' : 'News', href: `/${locale}/news` },
        { label: news.title },
      ]} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-10">
            <time className="text-sm font-medium text-primary-600 uppercase tracking-wider">{formatDate(news.publishDate)}</time>
            <h1 className="text-4xl font-bold text-neutral-900 mt-3 mb-4">{news.title}</h1>
            {news.author && <p className="text-sm text-neutral-600">By {news.author}</p>}
          </header>

          {news.coverImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10 mb-8">
              <img
                src={getStrapiImageUrl(news.coverImage.url) || '/placeholder.png'}
                alt={news.coverImage.alternativeText || news.title}
                className="w-full h-[360px] object-cover"
              />
            </div>
          )}

          <div
            className="text-neutral-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </article>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: news.title,
          description: news.seoDescription,
          datePublished: news.publishDate,
          author: news.author ? { '@type': 'Person', name: news.author } : undefined,
          image: news.coverImage ? getStrapiImageUrl(news.coverImage.url) : undefined,
        }}
      />
    </div>
  );
}
