import { notFound } from 'next/navigation';
import { getProductCategories, getProducts, ProductData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getStrapiImageUrl } from '@/lib/strapi';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  const [categories, products] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getProducts(locale).catch(() => []),
  ]);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href={`/${locale}/products`}
              className="btn-primary text-sm"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/products/category/${cat.slug}`}
                className="btn-secondary text-sm"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product Grid */}
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
                  {product.category && (
                    <Badge className="mt-3">{product.category.name}</Badge>
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
