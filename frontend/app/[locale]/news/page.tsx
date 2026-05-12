import { notFound } from 'next/navigation';
import Image from 'next/image';
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
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900">News</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item: NewsData) => (
            <Link key={item.slug} href={`/${locale}/news/${item.slug}`}>
              <Card className="h-full">
                {item.coverImage && (
                  <div className="relative overflow-hidden h-52">
                    <Image
                      src={getStrapiImageUrl(item.coverImage.url) || '/placeholder.png'}
                      alt={item.coverImage.alternativeText || item.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <time className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                    {new Date(item.publishDate).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="font-semibold text-lg text-neutral-900 mt-2 mb-2 line-clamp-2 font-display">{item.title}</h3>
                  {item.seoDescription && (
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{item.seoDescription}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {pagination.pageCount > 1 && (
          <div className="mt-12 flex justify-center">
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
