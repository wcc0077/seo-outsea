import Link from 'next/link';
import Navbar from './Navbar';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  siteName: string;
  logoUrl: string | null;
  navLinks: Array<{ label: string; href: string }>;
  locale: string;
}

export default function Header({ siteName, logoUrl, navLinks, locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold text-primary-700">{siteName}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Navbar navLinks={navLinks} locale={locale} />
          </div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
