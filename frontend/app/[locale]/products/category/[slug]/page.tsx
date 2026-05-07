import { notFound } from 'next/navigation';
import { getProductCategoryBySlug, getProductsByCategory, ProductData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getStrapiImageUrl } from '@/lib/strapi';

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

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
        {category.description && (
          <div
            className="text-gray-600 prose prose-sm max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: ProductData) => (
            <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
              <Card className="h-full">
                {product.images?.[0] && (
                  <img
                    src={getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                    alt={product.images[0].alternativeText || product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
