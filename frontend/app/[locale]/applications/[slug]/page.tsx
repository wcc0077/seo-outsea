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
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{app.name}</h1>

        {app.images?.[0] && (
          <img
            src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
            alt={app.name}
            className="w-full rounded-xl object-cover mb-8"
          />
        )}

        {app.description && (
          <p className="text-lg text-gray-600 mb-8">{app.description}</p>
        )}

        {app.useCase && (
          <div
            className="text-gray-600 prose prose-sm max-w-none"
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
