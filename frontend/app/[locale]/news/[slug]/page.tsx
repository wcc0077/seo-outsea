import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getNewsBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const LOCALE_DATE_FORMAT: Record<string, string> = {
  en: 'en-US', zh: 'zh-CN', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', ru: 'ru-RU',
};

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug, locale).catch(() => null);
  if (!news) return {};

  const title = news.seoTitle || news.title;
  const description = news.seoDescription || news.content?.replace(/<[^>]*>/g, '').slice(0, 160);
  const imageUrl = news.coverImage ? getStrapiImageUrl(news.coverImage.url) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
      publishedTime: news.publishDate,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug, locale);

  if (!news) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(LOCALE_DATE_FORMAT[locale] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const t = await getTranslations({ locale, namespace: 'NewsDetail' });

  return (
    <div className="py-20">
      <Breadcrumb locale={locale} items={[
        { label: t('news'), href: `/${locale}/news` },
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
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10 mb-8 relative h-[360px]">
              <Image
                src={getStrapiImageUrl(news.coverImage.url) || '/placeholder.png'}
                alt={news.coverImage.alternativeText || news.title}
                fill
                className="object-cover"
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
