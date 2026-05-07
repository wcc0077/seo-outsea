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

export default function MegaMenu({ navLinks, locale }: MegaMenuProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }

  function getDropdownItems(): NavItem['children'] | null {
    const link = navLinks.find((l) => l.href === activeKey);
    return link?.children ?? null;
  }

  const dropdownItems = getDropdownItems();

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

      {/* Mega dropdown — fixed position, full viewport width */}
      {dropdownItems && (
        <div
          ref={dropdownRef}
          className="fixed left-0 right-0 z-[60] animate-fade-in-down"
          onMouseEnter={clearTimer}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="bg-neutral-900 border-b border-primary-500/20 shadow-2xl shadow-primary-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex gap-10">
                {dropdownItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="text-sm text-neutral-300 hover:text-primary-400 transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
