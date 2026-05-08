import Link from 'next/link';
import { GlobalData, getStrapiImageUrl } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
}

export default async function Footer({ global, locale }: FooterProps) {
  const contact = global?.contactInfo;
  const t = await getTranslations({ locale, namespace: 'Footer' });

  return (
    <footer className="bg-neutral-950 text-neutral-400 relative overflow-hidden">
      {/* RF wave decorative pattern */}
      <div className="absolute inset-0 bg-rf-waves opacity-50" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top accent line */}
        <div className="h-px w-24 bg-gradient-to-r from-primary-500 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4 font-display text-lg">{global?.siteName || 'FN Tech'}</h3>
            {contact && (
              <div className="space-y-2 text-sm leading-relaxed">
                {contact.address && <p>{contact.address}</p>}
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-400 transition-colors block">
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="hover:text-primary-400 transition-colors block">
                    {contact.email}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display">{t('products')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">{t('readers')}</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">{t('tags')}</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">{t('mobile')}</Link></li>
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display">{t('applications')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('manufacturing')}</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('logistics')}</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('assets')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display">{t('support')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/support`} className="hover:text-primary-400 transition-colors">{t('techSupport')}</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-primary-400 transition-colors">{t('knowledgeBase')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-primary-400 transition-colors">{t('contactUs')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-sm text-center text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>{t('copyright', { name: global?.siteName || 'FN Tech', startYear: 2006, endYear: new Date().getFullYear() })}</span>
          {/* Decorative RF dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
