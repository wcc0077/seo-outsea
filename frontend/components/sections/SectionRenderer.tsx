import { SectionData, getOffices, getClients, getStats, OfficeData, ClientData, StatData } from '@/lib/strapi';
import dynamic from 'next/dynamic';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import ApplicationShowcase from './ApplicationShowcase';
import NewsList from './NewsList';
import TextImage from './TextImage';
import StatsSection from './StatsSection';
import FAQSection from './FAQSection';
import Spacer from './Spacer';
import ClientLogos from './ClientLogos';
import CertificateGallery from './CertificateGallery';

const OfficesSection = dynamic(() => import('./OfficesSection'), {
  ssr: false,
  loading: () => <div className="h-96 bg-neutral-100 animate-pulse rounded-xl" />,
});

interface SectionRendererProps {
  section: SectionData;
  locale: string;
  offices?: OfficeData[];
  clients?: ClientData[];
  stats?: StatData[];
}

export default async function SectionRenderer({ section, locale, offices, clients, stats }: SectionRendererProps) {
  switch (section.__component) {
    case 'sections.hero-section':
      return <HeroSection {...(section as unknown as Parameters<typeof HeroSection>[0])} />;

    case 'sections.product-grid':
      return <ProductGrid {...(section as unknown as Parameters<typeof ProductGrid>[0])} />;

    case 'sections.application-showcase':
      return <ApplicationShowcase {...(section as unknown as Parameters<typeof ApplicationShowcase>[0])} />;

    case 'sections.news-list':
      return <NewsList {...(section as unknown as Parameters<typeof NewsList>[0])} />;

    case 'sections.text-image':
      return <TextImage {...(section as unknown as Parameters<typeof TextImage>[0])} />;

    case 'sections.stats-section':
      return <StatsSection stats={stats} {...(section as unknown as Parameters<typeof StatsSection>[0])} />;

    case 'sections.faq-section':
      return <FAQSection {...(section as unknown as Parameters<typeof FAQSection>[0])} />;

    case 'sections.contact-form':
      return null;

    case 'sections.spacer':
      return <Spacer {...(section as unknown as Parameters<typeof Spacer>[0])} />;

    case 'sections.offices-section': {
      const sectionOffices = offices ?? await getOffices(locale);
      const s = section as unknown as Record<string, unknown>;
      return (
        <OfficesSection
          locale={locale}
          offices={sectionOffices}
          mapConfig={{
            centerLat: (s.mapCenterLat as number) ?? 33,
            centerLng: (s.mapCenterLng as number) ?? 108,
            zoom: (s.mapZoom as number) ?? 5,
          }}
          title={s.title as string | undefined}
        />
      );
    }

    case 'sections.client-logos-section': {
      const sectionClients = clients ?? await getClients(locale);
      const s = section as unknown as Record<string, unknown>;
      return <ClientLogos title={s.title as string | undefined} clients={sectionClients} />;
    }

    case 'sections.certificate-gallery-section': {
      const s = section as unknown as Record<string, unknown>;
      return <CertificateGallery title={s.title as string | undefined} certificates={s.certificates as Array<{ title: string; image?: { url: string }; category?: string }> | undefined} />;
    }

    default:
      return null;
  }
}
