import Link from 'next/link';
import { GlobalData, getStrapiImageUrl } from '@/lib/strapi';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
}

export default function Footer({ global, locale }: FooterProps) {
  const contact = global?.contactInfo;

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
            <h3 className="text-white font-semibold mb-4 font-display">Products</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">RFID Readers</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">RFID Tags</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">Mobile Terminals</Link></li>
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display">Applications</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">Smart Manufacturing</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">Warehouse & Logistics</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">Asset Management</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/support`} className="hover:text-primary-400 transition-colors">Technical Support</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-primary-400 transition-colors">Knowledge Base</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-sm text-center text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} {global?.siteName || 'FN Tech'}. All rights reserved.</span>
          {/* Decorative RF dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
