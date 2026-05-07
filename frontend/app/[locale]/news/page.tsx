import { notFound } from 'next/navigation';
import { getPublishedNews, NewsData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { getStrapiImageUrl } from '@/lib/strapi';
import { PAGE_SIZE } from '@/lib/constants';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ params, searchParams }: NewsPageProps) {
  const { locale } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));

  const { data: news, meta } = await getPublishedNews(locale, page, PAGE_SIZE).catch(
    () => ({ data: [], meta: { pagination: { page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 } } })
  );

  const { pagination } = meta;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">News</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: NewsData) => (
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
                  <time className="text-xs text-gray-500">
                    {new Date(item.publishDate).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="font-semibold text-lg text-gray-900 mt-2 mb-2 line-clamp-2">{item.title}</h3>
                  {item.seoDescription && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.seoDescription}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {pagination.pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pageCount}
              basePath="/news"
              locale={locale}
            />
          </div>
        )}
      </div>
    </div>
  );
}
