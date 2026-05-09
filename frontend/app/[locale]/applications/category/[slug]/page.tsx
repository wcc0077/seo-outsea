import { notFound } from 'next/navigation';
import { getApplicationCategoryBySlug, getApplicationsByCategory, ApplicationData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { getStrapiImageUrl } from '@/lib/strapi';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface AppCategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function AppCategoryPage({ params }: AppCategoryPageProps) {
  const { locale, slug } = await params;

  const [category, applications] = await Promise.all([
    getApplicationCategoryBySlug(slug, locale),
    getApplicationsByCategory(slug, locale).catch(() => []),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="py-20 bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb locale={locale} items={[
          { label: locale === 'zh' ? '行业应用' : 'Applications', href: `/${locale}/applications` },
          { label: category.name },
        ]} />

        <div className="mb-12">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">{category.name}</h1>
          {category.description && (
            <div
              className="text-neutral-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app: ApplicationData) => (
              <Link key={app.slug} href={`/${locale}/applications/${app.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100">
                  {app.images?.[0] && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-[4/3]">
                      <img
                        src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
                        alt={app.images[0].alternativeText || app.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-base text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {app.name}
                    </h3>
                    {app.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-neutral-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-500 text-lg">暂无应用案例</p>
          </div>
        )}
      </div>
    </div>
  );
}
