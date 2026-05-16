import { notFound } from 'next/navigation';
import { getPageBySlug, PageData, SectionData, getOffices, getClients, getStats, OfficeData, ClientData, StatData } from '@/lib/strapi';
import SectionRenderer from '@/components/sections/SectionRenderer';

interface GenericPageProps {
  params: Promise<{ locale: string }>;
  slug: string;
}

export default async function GenericPage({ params, slug }: GenericPageProps) {
  const { locale } = await params;
  const page = await getPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  const needsOffices = page.sections?.some(s => s.__component === 'sections.offices-section');
  const needsClients = page.sections?.some(s => s.__component === 'sections.client-logos-section');
  const needsStats = page.sections?.some(s => s.__component === 'sections.stats-section');

  const [offices, clients, stats] = await Promise.all([
    needsOffices ? getOffices(locale) : Promise.resolve(undefined),
    needsClients ? getClients(locale) : Promise.resolve(undefined),
    needsStats ? getStats(locale) : Promise.resolve(undefined),
  ]);

  return (
    <>
      {page.heroBanner && (
        <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
          {/* RF wave decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="relative w-[600px] h-[600px]">
              <div className="absolute inset-0 rounded-full border border-primary-500/10" />
              <div className="absolute inset-12 rounded-full border border-primary-500/8" />
              <div className="absolute inset-24 rounded-full border border-primary-500/5" />
            </div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-5">{page.heroBanner.title}</h1>
            {page.heroBanner.subtitle && (
              <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">{page.heroBanner.subtitle}</p>
            )}
          </div>
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
        </section>
      )}
      {page.sections?.map((section: SectionData, index: number) => (
        <SectionRenderer key={index} section={section} locale={locale} offices={offices} clients={clients} stats={stats} />
      ))}
    </>
  );
}