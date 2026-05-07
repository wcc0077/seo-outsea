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
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-14">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {news.slice(0, 6).map((item) => (
            <Link key={item.slug} href={`/${locale}/news/${item.slug}`}>
              <Card className="h-full">
                {item.coverImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={getStrapiImageUrl(item.coverImage.url) || '/placeholder.png'}
                      alt={item.coverImage.alternativeText || item.title}
                      className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs font-medium text-primary-600 uppercase tracking-wider">{formatDate(item.publishDate)}</time>
                  <h3 className="font-semibold text-lg text-neutral-900 mt-2 mb-2 line-clamp-2 font-display">{item.title}</h3>
                  {item.seoDescription && (
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{item.seoDescription}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/news`}
            className="btn-secondary"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}
