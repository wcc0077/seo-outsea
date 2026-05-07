import { notFound } from 'next/navigation';
import { getPageBySlug, getProducts, getApplications, getPublishedNews, PageData } from '@/lib/strapi';
import HeroSection from '@/components/sections/HeroSection';
import ProductGrid from '@/components/sections/ProductGrid';
import ApplicationShowcase from '@/components/sections/ApplicationShowcase';
import NewsList from '@/components/sections/NewsList';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { REVALIDATE_INTERVAL } from '@/lib/constants';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Try to fetch the homepage page by slug
  const page = await getPageBySlug('home', locale).catch(() => null);

  // Fallback: fetch featured content if no page configured
  const [products, applications, news] = await Promise.all([
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 3).catch(() => ({ data: [], meta: {} })),
  ]);

  if (!page) {
    // Render fallback homepage with featured content
    return (
      <>
        <HeroSection
          title="Industrial RFID Solutions"
          subtitle="Professional RFID hardware for smart manufacturing, logistics, and asset management."
          ctaLabel="Explore Products"
          ctaUrl={`/${locale}/products`}
        />
        <ProductGrid title="Featured Products" products={products} locale={locale} />
        <ApplicationShowcase title="Key Applications" applications={applications} locale={locale} />
        <NewsList title="Latest News" news={news.data} locale={locale} />
      </>
    );
  }

  return (
    <>
      {page.heroBanner && (
        <HeroSection {...page.heroBanner} />
      )}
      {page.sections?.map((section, index) => (
        <SectionRenderer key={index} section={section} locale={locale} />
      ))}
    </>
  );
}
