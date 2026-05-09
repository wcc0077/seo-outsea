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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-14">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {applications
            .filter((app, idx, arr) => arr.findIndex(a => a.slug === app.slug) === idx)
            .slice(0, 6)
            .map((app) => (
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
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/applications`}
            className="btn-secondary"
          >
            View All Applications
          </Link>
        </div>
      </div>
    </section>
  );
}
