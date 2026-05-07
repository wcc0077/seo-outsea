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
    <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-neutral-900/70" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900">
          {/* RF wave decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="relative w-[800px] h-[800px]">
              <div className="absolute inset-12 rounded-full border border-primary-500/10" />
              <div className="absolute inset-24 rounded-full border border-primary-500/8" />
              <div className="absolute inset-36 rounded-full border border-primary-500/6" />
              <div className="absolute inset-48 rounded-full border border-primary-500/4" />
              <div className="absolute inset-60 rounded-full border border-primary-500/3" />
            </div>
          </div>
          {/* Subtle gradient noise */}
          <div className="absolute inset-0 bg-noise" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-28">
        {/* Accent line above title */}
        <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8 animate-fade-in" />

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
          {title}
        </h1>

        {subtitle && (
          <p className="text-lg sm:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto animate-fade-in-up font-light leading-relaxed">
            {subtitle}
          </p>
        )}

        {ctaLabel && ctaUrl && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
    </section>
  );
}
