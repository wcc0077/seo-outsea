import Link from 'next/link';
import Navbar from './Navbar';
import MegaMenu from './MegaMenu';
import LanguageSwitcher from './LanguageSwitcher';

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
}

export default function Header({ siteName, logoUrl, navLinks, locale, noBorder }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50">
      {/* Main header bar */}
      <div className={`bg-neutral-900 ${noBorder ? '' : 'border-b border-neutral-800 shadow-lg shadow-black/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
              ) : (
                <span className="text-xl font-bold text-white tracking-tight">
                  {siteName}
                  <span className="text-primary-400">.</span>
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <MegaMenu navLinks={navLinks} locale={locale} />

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
