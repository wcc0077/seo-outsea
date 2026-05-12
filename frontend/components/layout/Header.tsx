import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import MegaMenu from './MegaMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { ProductCategoryData, ProductData, ApplicationCategoryData, RfidTagData } from '@/lib/strapi';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

interface HeaderProps {
  siteName: string;
  logoUrl: string | null;
  navLinks: NavItem[];
  locale: string;
  noBorder?: boolean;
  productCategories: ProductCategoryData[];
  products: ProductData[];
  appCategories: ApplicationCategoryData[];
  rfidTags: RfidTagData[];
}

export default function Header({ siteName, logoUrl, navLinks, locale, noBorder, productCategories, products, appCategories, rfidTags }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      {/* Main header bar */}
      <div className={`bg-neutral-900 ${noBorder ? '' : 'border-b border-neutral-800 shadow-lg shadow-black/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <div className="relative h-8 w-auto">
                  <Image src={logoUrl} alt={siteName} fill className="object-contain" />
                </div>
              ) : (
                <span className="text-xl font-bold text-white tracking-tight">
                  {siteName}
                  <span className="text-primary-400">.</span>
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <MegaMenu
              navLinks={navLinks}
              locale={locale}
              productCategories={productCategories}
              products={products}
              appCategories={appCategories}
              rfidTags={rfidTags}
            />

            {/* Language Switcher + Mobile Menu */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLocale={locale} />
              <div className="md:hidden">
                <Navbar navLinks={navLinks} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
