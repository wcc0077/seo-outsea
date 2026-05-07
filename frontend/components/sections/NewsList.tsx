import Link from 'next/link';
import { getStrapiImageUrl, NewsData } from '@/lib/strapi';
import Card from '@/components/ui/Card';

interface NewsListProps {
  title?: string;
  news?: NewsData[];
  locale: string;
}

export default function NewsList({ title, news, locale }: NewsListProps) {
  if (!news || news.length === 0) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((item) => (
            <Link key={item.slug} href={`/${locale}/news/${item.slug}`}>
              <Card className="h-full">
                {item.coverImage && (
                  <img
                    src={getStrapiImageUrl(item.coverImage.url) || '/placeholder.png'}
                    alt={item.coverImage.alternativeText || item.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  <time className="text-xs text-gray-500">{formatDate(item.publishDate)}</time>
                  <h3 className="font-semibold text-lg text-gray-900 mt-2 mb-2 line-clamp-2">{item.title}</h3>
                  {item.seoDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.seoDescription}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/news`}
            className="inline-block btn-secondary"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
