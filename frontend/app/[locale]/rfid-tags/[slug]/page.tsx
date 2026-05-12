import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getRfidTagBySlug, RfidTagData } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import Badge from '@/components/ui/Badge';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface RfidTagDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function RfidTagDetailPage({ params }: RfidTagDetailPageProps) {
  const { locale, slug } = await params;
  const tag = await getRfidTagBySlug(slug, locale);

  if (!tag) {
    notFound();
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb locale={locale} items={[
          { label: locale === 'zh' ? 'RFID电子标签' : 'RFID Tags', href: `/${locale}/rfid-tags` },
          ...(tag.category ? [{ label: tag.category.name, href: `/${locale}/rfid-tags/category/${tag.category.slug}` }] : []),
          { label: tag.name },
        ]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {(tag.images?.[0] || tag.imageUrl) && (
              <div className="rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10 relative h-[400px]">
                <Image
                  src={tag.imageUrl || getStrapiImageUrl(tag.images[0].url) || '/placeholder.png'}
                  alt={tag.images?.[0]?.alternativeText || tag.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{tag.name}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {tag.category && <Badge variant="primary">{tag.category.name}</Badge>}
              {tag.frequency && <Badge variant="accent">{tag.frequency}</Badge>}
            </div>
            {tag.description && (
              <div
                className="text-neutral-600 prose prose-sm max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: tag.description }}
              />
            )}

            {/* Specs */}
            {tag.specs && tag.specs.length > 0 && (
              <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200/80 mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 font-display">Specifications</h2>
                <dl className="space-y-2">
                  {tag.specs.map((spec: { name: string; value: string }, i: number) => (
                    <div key={i} className="flex justify-between py-2 border-b border-neutral-200 last:border-0">
                      <dt className="text-sm text-neutral-600">{spec.name}</dt>
                      <dd className="text-sm font-medium text-neutral-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Application Scenarios */}
            {tag.applicationScenarios && (
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-4 font-display">Application Scenarios</h2>
                <div
                  className="text-neutral-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: tag.applicationScenarios }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: tag.name,
          description: tag.description,
          image: tag.imageUrl || (tag.images?.[0] ? getStrapiImageUrl(tag.images[0].url) : undefined),
        }}
      />
    </div>
  );
}
