'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  navLinks: Array<{ label: string; href: string }>;
  locale: string;
}

export default function Navbar({ navLinks, locale }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu panel */}
      {open && (
        <div className="absolute top-[72px] left-0 right-0 bg-neutral-900 border-b border-neutral-700/50 shadow-2xl md:hidden z-50 animate-fade-in-down">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="py-3 text-sm font-medium text-neutral-300 hover:text-white border-b border-neutral-800 last:border-0 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
