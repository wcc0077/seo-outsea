import { notFound } from 'next/navigation';
import { getProductBySlug, ProductData } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import Badge from '@/components/ui/Badge';
import JsonLd from '@/components/seo/JsonLd';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {product.images?.[0] && (
              <img
                src={getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                alt={product.images[0].alternativeText || product.name}
                className="w-full rounded-xl object-cover"
              />
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            {product.category && (
              <Badge className="mb-6">{product.category.name}</Badge>
            )}
            {product.description && (
              <div
                className="text-gray-600 prose prose-sm max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
                <dl className="space-y-2">
                  {product.specs.map((spec: { name: string; value: string }, i: number) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <dt className="text-sm text-gray-600">{spec.name}</dt>
                      <dd className="text-sm font-medium text-gray-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images?.[0] ? getStrapiImageUrl(product.images[0].url) : undefined,
        }}
      />
    </div>
  );
}
