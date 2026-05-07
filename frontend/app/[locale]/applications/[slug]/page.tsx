import { notFound } from 'next/navigation';
import { getApplicationBySlug } from '@/lib/strapi';
import { getStrapiImageUrl } from '@/lib/strapi';
import JsonLd from '@/components/seo/JsonLd';

interface ApplicationDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { locale, slug } = await params;
  const app = await getApplicationBySlug(slug, locale);

  if (!app) {
    notFound();
  }

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">{app.name}</h1>
        </div>

        {app.images?.[0] && (
          <div className="rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10 mb-8">
            <img
              src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
              alt={app.name}
              className="w-full h-[360px] object-cover"
            />
          </div>
        )}

        {app.description && (
          <p className="text-lg text-neutral-600 mb-8 leading-relaxed">{app.description}</p>
        )}

        {app.useCase && (
          <div
            className="text-neutral-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: app.useCase }}
          />
        )}
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: app.name,
          description: app.description,
          image: app.images?.[0] ? getStrapiImageUrl(app.images[0].url) : undefined,
        }}
      />
    </div>
  );
}
