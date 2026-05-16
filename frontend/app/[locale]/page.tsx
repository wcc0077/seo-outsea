import { getPageBySlug, getProducts, getApplications, getPublishedNews, getClients } from '@/lib/strapi';
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
  const [products, applications, news, clients] = await Promise.all([
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 3).catch(() => ({ data: [], meta: {} })),
    getClients(locale).catch(() => []),
  ]);

  if (!page) {
    // Translate fallback strings
    const t = await getTranslations({ locale, namespace: 'Home' });

    // Render fallback homepage with featured content
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
        <CompanyStats title={t('statsTitle')} subtitle={t('statsSubtitle')} />
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
        <SectionRenderer key={index} section={section} locale={locale} />
      ))}
    </>
  );
}
