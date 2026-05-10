import { notFound } from 'next/navigation';
import { getProductBySlug, ProductData, ProductTagData } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import Badge from '@/components/ui/Badge';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductImageZoom from '@/components/ui/ProductImageZoom';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function getTagColorVariant(color?: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    default: 'default',
  };
  return colorMap[color || 'default'] || 'default';
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const mainImageUrl = product.imageUrl || getStrapiImageUrl(product.images?.[0]?.url) || '/placeholder.png';

  return (
    <div className="py-20 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb locale={locale} items={[
          { label: locale === 'zh' ? '产品中心' : 'Products', href: `/${locale}/products` },
          ...(product.category ? [{ label: product.category.name, href: `/${locale}/products/category/${product.category.slug}` }] : []),
          { label: product.name },
        ]} />

        {/* Main Content */}
        <div className="mt-8 relative overflow-visible">
          {/* Top Row: Image + Zoom Panel + Product Info */}
          <div className="flex gap-8 items-start">
            {/* Image Section - includes main image + zoom panel */}
            <ProductImageZoom
              mainImage={mainImageUrl}
              alt={product.images?.[0]?.alternativeText || product.name}
              images={product.images?.map(img => ({
                url: getStrapiImageUrl(img.url) || '/placeholder.png',
                alternativeText: img.alternativeText || product.name
              }))}
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0 max-w-md">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/60 p-6">
                <h1 className="text-2xl font-bold text-neutral-900 mb-3">{product.name}</h1>

                {/* Category Badge */}
                {product.category && (
                  <div className="mb-3">
                    <Badge variant="primary" className="text-sm">{product.category.name}</Badge>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag: ProductTagData, i: number) => (
                      <Badge key={i} variant={getTagColorVariant(tag.color)} className="text-xs px-3 py-1">
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div
                    className="text-neutral-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>

              {/* Specifications - compact */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl shadow-sm border border-neutral-200/60 p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                    {locale === 'zh' ? '技术规格' : 'Specifications'}
                  </h2>
                  <dl className="space-y-2">
                    {product.specs.slice(0, 6).map((spec: { name: string; value: string }, i: number) => (
                      <div key={i} className="flex justify-between py-2 border-b border-neutral-100 last:border-0">
                        <dt className="text-sm text-neutral-500">{spec.name}</dt>
                        <dd className="text-sm text-neutral-900 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Full Specifications */}
          {product.specs && product.specs.length > 6 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-neutral-200/60 p-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {locale === 'zh' ? '完整技术规格' : 'Full Technical Specifications'}
              </h2>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
                {product.specs.map((spec: { name: string; value: string }, i: number) => (
                  <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                    <dt className="text-sm text-neutral-500">{spec.name}</dt>
                    <dd className="text-sm text-neutral-900 font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* RF Frequency & OS Info */}
          <div className="mt-6 flex gap-4">
            {product.rfidFrequency && (
              <div className="bg-blue-50 rounded-xl border border-blue-200/60 p-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-blue-800 font-medium">{locale === 'zh' ? 'RFID频率' : 'RFID Frequency'}</p>
                    <p className="text-blue-600 font-semibold uppercase">{product.rfidFrequency}</p>
                  </div>
                </div>
              </div>
            )}

            {product.os && (
              <div className="bg-neutral-100 rounded-xl border border-neutral-200/60 p-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 font-medium">{locale === 'zh' ? '操作系统' : 'Operating System'}</p>
                    <p className="text-neutral-900 font-semibold capitalize">{product.os}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white max-w-md">
            <h3 className="font-semibold text-lg mb-2">
              {locale === 'zh' ? '需要产品咨询?' : 'Need Product Consultation?'}
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              {locale === 'zh'
                ? '我们的专家团队随时为您提供技术支持和解决方案'
                : 'Our expert team is ready to provide technical support and solutions'}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              {locale === 'zh' ? '联系我们' : 'Contact Us'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description?.replace(/<[^>]*>/g, ''),
          image: mainImageUrl,
          category: product.category?.name,
        }}
      />
    </div>
  );
}