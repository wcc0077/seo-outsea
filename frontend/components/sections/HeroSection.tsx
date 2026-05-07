import Link from 'next/link';
import { getStrapiImageUrl } from '@/lib/strapi';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: { url: string; alternativeText: string };
  ctaLabel?: string;
  ctaUrl?: string;
}

export default function HeroSection({ title, subtitle, backgroundImage, ctaLabel, ctaUrl }: HeroSectionProps) {
  const bgImage = getStrapiImageUrl(backgroundImage?.url);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
        {subtitle && <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
