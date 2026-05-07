import { notFound } from 'next/navigation';
import { getPageBySlug, PageData, SectionData } from '@/lib/strapi';
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

  return (
    <>
      {page.heroBanner && (
        <section className="bg-gradient-to-br from-primary-900 to-primary-950 text-white py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">{page.heroBanner.title}</h1>
            {page.heroBanner.subtitle && (
              <p className="text-lg text-gray-200">{page.heroBanner.subtitle}</p>
            )}
          </div>
        </section>
      )}
      {page.sections?.map((section: SectionData, index: number) => (
        <SectionRenderer key={index} section={section} locale={locale} />
      ))}
    </>
  );
}
