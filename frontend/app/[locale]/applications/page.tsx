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
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900">Applications</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app: ApplicationData) => (
            <Link key={app.slug} href={`/${locale}/applications/${app.slug}`}>
              <Card className="h-full">
                {app.images?.[0] && (
                  <div className="relative overflow-hidden">
                    <img
                      src={getStrapiImageUrl(app.images[0].url) || '/placeholder.png'}
                      alt={app.name}
                      className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2 font-display">{app.name}</h3>
                  {app.description && (
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{app.description}</p>
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
