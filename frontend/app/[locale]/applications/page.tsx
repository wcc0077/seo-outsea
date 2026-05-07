import { notFound } from 'next/navigation';
import { getApplications, ApplicationData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { getStrapiImageUrl } from '@/lib/strapi';

interface ApplicationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ApplicationsPage({ params }: ApplicationsPageProps) {
  const { locale } = await params;
  const applications = await getApplications(locale).catch(() => []);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Applications</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app: ApplicationData) => (
            <Link key={app.slug} href={`/${locale}/applications/${app.slug}`}>
              <Card className="h-full">
                {app.images?.[0] && (
                  <img
                    src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
                    alt={app.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{app.name}</h3>
                  {app.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
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
