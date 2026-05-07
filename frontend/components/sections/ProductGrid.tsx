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
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-14">
            {/* Accent line */}
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {products.slice(0, 6).map((product) => (
            <Link key={product.slug} href={`/${locale}/products/${product.slug}`}>
              <Card className="h-full">
                {(product.images?.[0] || product.imageUrl) && (
                  <div className="relative overflow-hidden">
                    <img
                      src={product.imageUrl || getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                      alt={product.images?.[0]?.alternativeText || product.name}
                      className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {/* Subtle overlay gradient */}
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
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/products`}
            className="btn-secondary"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
