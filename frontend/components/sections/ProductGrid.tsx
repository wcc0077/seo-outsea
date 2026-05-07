import Link from 'next/link';
import { getStrapiImageUrl, ProductData } from '@/lib/strapi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ProductGridProps {
  title?: string;
  products?: ProductData[];
  categorySlug?: string;
  locale: string;
}

export default function ProductGrid({ title, products, locale }: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
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
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/products`}
            className="inline-block btn-secondary"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
