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
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {(product.images?.[0] || product.imageUrl) && (
              <div className="rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10">
                <img
                  src={product.imageUrl || getStrapiImageUrl(product.images[0].url) || '/placeholder.png'}
                  alt={product.images?.[0]?.alternativeText || product.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{product.name}</h1>
            {product.category && (
              <Badge className="mb-6" variant="primary">{product.category.name}</Badge>
            )}
            {product.description && (
              <div
                className="text-neutral-600 prose prose-sm max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200/80">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 font-display">Specifications</h2>
                <dl className="space-y-2">
                  {product.specs.map((spec: { name: string; value: string }, i: number) => (
                    <div key={i} className="flex justify-between py-2 border-b border-neutral-200 last:border-0">
                      <dt className="text-sm text-neutral-600">{spec.name}</dt>
                      <dd className="text-sm font-medium text-neutral-900">{spec.value}</dd>
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
          image: product.imageUrl || (product.images?.[0] ? getStrapiImageUrl(product.images[0].url) : undefined),
        }}
      />
    </div>
  );
}
