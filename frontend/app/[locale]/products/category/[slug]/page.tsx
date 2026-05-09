import { notFound } from 'next/navigation';
import { getProductCategoryBySlug, getProductsByCategory, ProductData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getStrapiImageUrl } from '@/lib/strapi';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;

  const [category, products] = await Promise.all([
    getProductCategoryBySlug(slug, locale),
    getProductsByCategory(slug, locale).catch(() => []),
  ]);

  if (!category) {
    notFound();
  }

  // Deduplicate by slug
  const uniqueProducts = products.filter((p, idx, arr) => arr.findIndex(x => x.slug === p.slug) === idx);

  return (
    <div className="py-20 bg-gradient-to-b from-neutral-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb locale={locale} items={[
          { label: locale === 'zh' ? '产品中心' : 'Products', href: `/${locale}/products` },
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

        {uniqueProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uniqueProducts.map(product => (
              <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-neutral-100">
                  <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 aspect-[4/3]">
                    {(product.images?.[0] || product.imageUrl) ? (
                      <>
                        <img
                          src={product.imageUrl || getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                          alt={product.images?.[0]?.alternativeText || product.name}
                          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-300">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-base text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                        {product.description.replace(/[#*`]/g, '').trim()}
                      </p>
                    )}
                    {product.category && (
                      <Badge variant="primary" className="text-xs">{product.category.name}</Badge>
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
            <p className="text-neutral-500 text-lg">No products in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
