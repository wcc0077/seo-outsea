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
        className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden z-50">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="py-3 text-sm font-medium text-gray-600 hover:text-primary-600 border-b border-gray-100 last:border-0"
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
