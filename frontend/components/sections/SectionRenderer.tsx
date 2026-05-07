import { SectionData } from '@/lib/strapi';
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import ApplicationShowcase from './ApplicationShowcase';
import NewsList from './NewsList';
import TextImage from './TextImage';
import StatsSection from './StatsSection';
import FAQSection from './FAQSection';
import ContactForm from './ContactForm';
import Spacer from './Spacer';

interface SectionRendererProps {
  section: SectionData;
  locale: string;
}

export default function SectionRenderer({ section, locale }: SectionRendererProps) {
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
      return <StatsSection {...(section as unknown as Parameters<typeof StatsSection>[0])} />;

    case 'sections.faq-section':
      return <FAQSection {...(section as unknown as Parameters<typeof FAQSection>[0])} />;

    case 'sections.contact-form':
      return <ContactForm {...(section as unknown as Parameters<typeof ContactForm>[0])} />;

    case 'sections.spacer':
      return <Spacer {...(section as unknown as Parameters<typeof Spacer>[0])} />;

    default:
      return null;
  }
}
