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
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900">Products</h1>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: ProductData) => (
            <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
              <Card className="h-full">
                {(product.images?.[0] || product.imageUrl) && (
                  <div className="relative overflow-hidden">
                    <img
                      src={product.imageUrl || getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                      alt={product.images?.[0]?.alternativeText || product.name}
                      className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2 font-display">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{product.description}</p>
                  )}
                  {product.category && (
                    <Badge className="mt-4" variant="primary">{product.category.name}</Badge>
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
