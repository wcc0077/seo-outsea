import { getPageBySlug, getProducts, getApplications, getPublishedNews, getClients, getStats } from '@/lib/strapi';
import HeroSection from '@/components/sections/HeroSection';
import AnimatedHero from '@/components/sections/AnimatedHero';
import ProductGrid from '@/components/sections/ProductGrid';
import ApplicationShowcase from '@/components/sections/ApplicationShowcase';
import CompanyStats from '@/components/sections/CompanyStats';
import ClientLogos from '@/components/sections/ClientLogos';
import NewsList from '@/components/sections/NewsList';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { getTranslations } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Try to fetch the homepage page by slug
  const page = await getPageBySlug('home', locale).catch(() => null);

  // Fallback: fetch featured content if no page configured
  const [products, applications, news, clients, stats] = await Promise.all([
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 3).catch(() => ({ data: [], meta: {} })),
    getClients(locale).catch(() => []),
    getStats(locale).catch(() => []),
  ]);

  if (!page) {
    // Translate fallback strings
    const t = await getTranslations({ locale, namespace: 'Home' });

    // Render fallback homepage with featured content from Strapi collections
    return (
      <>
        <AnimatedHero
          title={t('heroTitle')}
          subtitle={t('heroSubtitle')}
          ctaLabel={t('heroCta')}
          ctaUrl={`/${locale}/products`}
          slogan={t('heroSlogan')}
        />
        <ProductGrid title={t('featuredProducts')} products={products} locale={locale} />
        {stats.length > 0 && <CompanyStats title={t('statsTitle')} subtitle={t('statsSubtitle')} stats={stats} />}
        <ApplicationShowcase title={t('keyApplications')} applications={applications} locale={locale} />
        <ClientLogos title={t('clientLogosTitle')} clients={clients} />
        <NewsList title={t('latestNews')} news={news.data} locale={locale} />
      </>
    );
  }

  return (
    <>
      {page.heroBanner && (
        <HeroSection {...page.heroBanner} />
      )}
      {page.sections?.map((section, index) => (
        <SectionRenderer key={index} section={section} locale={locale} stats={stats} clients={clients} />
      ))}
    </>
  );
}