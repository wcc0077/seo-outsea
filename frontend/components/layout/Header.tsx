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
    <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-700/50 shadow-lg shadow-neutral-900/20">
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
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-400 after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Mobile Menu */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <div className="md:hidden">
              <Navbar navLinks={navLinks} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
