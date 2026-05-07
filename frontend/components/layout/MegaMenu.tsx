'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

interface MegaMenuProps {
  navLinks: NavItem[];
  locale: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'hf-rfid-readers': '📡',
  'uhf-rfid-readers': '📡',
  'handheld-terminals': '',
  'industrial-tablets': '',
  'portable-readers': '',
};

export default function MegaMenu({ navLinks, locale }: MegaMenuProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerHeight = 72;

  function clearTimer() {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }

  function handleMouseEnter(href: string) {
    clearTimer();
    setActiveKey(href);
  }

  function handleDropdownLeave() {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveKey(null);
    }, 50);
  }

  function handleNavLeave() {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveKey(null);
    }, 50);
  }

  useEffect(() => {
    return () => clearTimer();
  }, []);

  function getActiveNavItem() {
    return navLinks.find((l) => l.href === activeKey) ?? null;
  }

  const activeNavItem = getActiveNavItem();

  return (
    <nav className="hidden md:flex items-center gap-8" onMouseLeave={handleNavLeave}>
      {navLinks.map((link) => (
        <div
          key={link.href}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(link.href)}
        >
          <Link
            href={`/${locale}${link.href}`}
            className={`text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-400 after:transition-all hover:after:w-full ${
              activeKey === link.href ? 'text-white' : 'text-neutral-300 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        </div>
      ))}

      {/* Mega dropdown overlay — positioned below the header bar */}
      {activeNavItem && activeNavItem.children && (
        <div
          className="fixed left-0 right-0 z-[60] animate-fade-in-down"
          style={{ top: `${headerHeight}px` }}
          onMouseEnter={clearTimer}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="bg-neutral-900/98 backdrop-blur-md border-b border-primary-500/10 shadow-2xl shadow-primary-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {activeNavItem.href === '/products' ? (
                <ProductsMegaMenu items={activeNavItem.children} locale={locale} />
              ) : activeNavItem.href === '/applications' ? (
                <ApplicationsMegaMenu items={activeNavItem.children} locale={locale} />
              ) : (
                <SupportDropdown items={activeNavItem.children} locale={locale} />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function ProductsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="group/card flex items-center gap-3 p-4 rounded-xl border border-neutral-700/50 bg-neutral-800/30 hover:bg-neutral-800/60 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-lg group-hover/card:bg-primary-500/20 transition-colors">
              {CATEGORY_ICONS[item.href.split('/').pop() || ''] || '📦'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white group-hover/card:text-primary-400 transition-colors truncate">
                {item.label}
              </div>
              <div className="text-xs text-neutral-500 mt-0.5 truncate">
                {getLocaleDescription(item.href)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ApplicationsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="group/card flex items-center gap-4 p-5 rounded-xl border border-neutral-700/50 bg-neutral-800/30 hover:bg-neutral-800/60 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/5 flex items-center justify-center group-hover/card:from-primary-500/30 group-hover/card:to-primary-600/10 transition-all">
              <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.716-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white group-hover/card:text-primary-400 transition-colors truncate">
                {item.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SupportDropdown({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="py-6">
      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {items.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="group/card flex items-center gap-3 p-4 rounded-xl border border-neutral-700/50 bg-neutral-800/30 hover:bg-neutral-800/60 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover/card:bg-primary-500/20 transition-colors">
              {getSupportIcon(item.href)}
            </div>
            <span className="text-sm font-medium text-white group-hover/card:text-primary-400 transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getSupportIcon(href: string) {
  const path = href;
  if (path.includes('/products')) {
    return (
      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  }
  if (path.includes('/contact')) {
    return (
      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function getLocaleDescription(href: string): string {
  const path = href;
  if (path.includes('hf-rfid')) return '13.56MHz · IO-LINK / ModbusTCP';
  if (path.includes('uhf-rfid')) return '860-960MHz · Long Range';
  if (path.includes('handheld')) return 'Android · Industrial Grade';
  if (path.includes('industrial')) return 'Fixed Mount · Edge Computing';
  if (path.includes('portable')) return 'Bluetooth · UHF Scanner';
  return '';
}
