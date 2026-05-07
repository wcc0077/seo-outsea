import Link from 'next/link';
import { getStrapiImageUrl, ApplicationData } from '@/lib/strapi';
import Card from '@/components/ui/Card';

interface ApplicationShowcaseProps {
  title?: string;
  applications?: ApplicationData[];
  locale: string;
}

export default function ApplicationShowcase({ title, applications, locale }: ApplicationShowcaseProps) {
  if (!applications || applications.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.slice(0, 6).map((app) => (
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
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/applications`}
            className="inline-block btn-secondary"
          >
            View All Applications
          </Link>
        </div>
      </div>
    </section>
  );
}
