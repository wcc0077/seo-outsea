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

const HEADER_HEIGHT = 72;

function getTechnicalSpec(href: string): string {
  if (href.includes('hf-rfid')) return '13.56MHz · IO-LINK / ModbusTCP';
  if (href.includes('uhf-rfid')) return '860-960MHz · Long Range';
  if (href.includes('handheld')) return 'Android · Industrial Grade';
  if (href.includes('industrial')) return 'Fixed Mount · Edge Computing';
  if (href.includes('portable')) return 'Bluetooth · UHF Scanner';
  return '';
}

function getCategoryIcon(path: string): React.ReactNode {
  if (path.includes('hf-rfid') || path.includes('uhf-rfid')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    );
  }
  if (path.includes('handheld')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    );
  }
  if (path.includes('industrial')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

export default function MegaMenu({ navLinks, locale }: MegaMenuProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    <>
      <nav className="hidden md:flex items-center gap-8" onMouseLeave={handleNavLeave}>
        {navLinks.map((link) => (
          <div
            key={link.href}
            className="relative"
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
      </nav>

      {/* Mega dropdown overlay — full width, positioned directly below header */}
      {activeNavItem && activeNavItem.children && (
        <div
          className="fixed left-0 right-0 z-[60] bg-neutral-900 border-t border-neutral-700/50 animate-fade-in-down"
          style={{ top: `${HEADER_HEIGHT}px` }}
          onMouseEnter={clearTimer}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {activeNavItem.href === '/products' ? (
              <ProductsMegaMenu items={activeNavItem.children} locale={locale} />
            ) : activeNavItem.href === '/applications' ? (
              <ApplicationsMegaMenu items={activeNavItem.children} locale={locale} />
            ) : (
              <SupportMegaMenu items={activeNavItem.children} locale={locale} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Products: 5-column grid ── */

function ProductsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className="group flex flex-col gap-3 rounded-xl border border-neutral-700/50 bg-neutral-800/60 p-5 hover:border-primary-500/40 hover:bg-neutral-800 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/15 transition-colors">
            {getCategoryIcon(item.href)}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white group-hover:text-primary-400 transition-colors leading-snug">
              {item.label}
            </div>
            <div className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              {getTechnicalSpec(item.href)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-600 group-hover:text-primary-400/60 transition-colors mt-auto pt-3 border-t border-neutral-700/30">
            查看全部
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Applications: 3×2 grid ── */

function ApplicationsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-700/50 bg-neutral-800/60 p-5 hover:border-primary-500/40 hover:bg-neutral-800 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/15 to-transparent flex items-center justify-center text-primary-400 group-hover:from-primary-500/20 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.716-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white group-hover:text-primary-400 transition-colors">
              {item.label}
            </div>
            <div className="flex items-center gap-1 text-xs text-neutral-500 group-hover:text-primary-400/60 mt-1 transition-colors">
              了解详情
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Support: 4-column compact ─── */

function SupportMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className="group flex items-center gap-4 rounded-xl border border-neutral-700/50 bg-neutral-800/60 p-5 hover:border-primary-500/40 hover:bg-neutral-800 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/15 transition-colors">
            {getSupportIcon(item.href)}
          </div>
          <span className="text-[13px] font-semibold text-white group-hover:text-primary-400 transition-colors">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

function getSupportIcon(href: string): React.ReactNode {
  if (href.includes('/products')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  }
  if (href.includes('/contact')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
