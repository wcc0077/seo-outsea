'use client';

import { useState } from 'react';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

interface NavbarProps {
  navLinks: NavItem[];
  locale: string;
}

export default function Navbar({ navLinks, locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  function toggleExpand(href: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

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
              <div key={link.href}>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}${link.href}`}
                    className="py-3 text-sm font-medium text-neutral-300 hover:text-white transition-colors flex-1"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children && link.children.length > 0 && (
                    <button
                      onClick={() => toggleExpand(link.href)}
                      className="p-2 text-neutral-400 hover:text-white transition-colors"
                      aria-label={`Expand ${link.label}`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedKeys.has(link.href) ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sub-menu accordion */}
                {link.children && expandedKeys.has(link.href) && (
                  <div className="pb-3 pl-4 border-l border-neutral-700/50 ml-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        className="block py-1.5 text-xs text-neutral-400 hover:text-primary-400 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="border-b border-neutral-800" />
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
