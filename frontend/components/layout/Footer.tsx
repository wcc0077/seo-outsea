import Link from 'next/link';
import { GlobalData, getStrapiImageUrl } from '@/lib/strapi';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
}

export default function Footer({ global, locale }: FooterProps) {
  const contact = global?.contactInfo;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{global?.siteName || 'FN Tech'}</h3>
            {contact && (
              <div className="space-y-2 text-sm">
                {contact.address && <p>{contact.address}</p>}
                {contact.phone && <p>{contact.phone}</p>}
                {contact.email && <p>{contact.email}</p>}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">RFID Readers</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">RFID Tags</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">Mobile Terminals</Link></li>
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-white font-semibold mb-4">Applications</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Smart Manufacturing</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Warehouse & Logistics</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Asset Management</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/support`} className="hover:text-white transition-colors">Technical Support</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-white transition-colors">Knowledge Base</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} {global?.siteName || 'FN Tech'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
