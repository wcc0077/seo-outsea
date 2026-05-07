import { notFound } from 'next/navigation';
import { getNewsBySlug, NewsData } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import JsonLd from '@/components/seo/JsonLd';

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
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8">
            <time className="text-sm text-gray-500">{formatDate(news.publishDate)}</time>
            <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{news.title}</h1>
            {news.author && <p className="text-sm text-gray-600">By {news.author}</p>}
          </header>

          {news.coverImage && (
            <img
              src={getStrapiImageUrl(news.coverImage.url) || '/placeholder.png'}
              alt={news.coverImage.alternativeText || news.title}
              className="w-full rounded-xl object-cover mb-8"
            />
          )}

          <div
            className="text-gray-600 prose prose-sm max-w-none"
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
