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

// ── Product data with images ──

type ProductEntry = { name: string; slug: string; image: string };

const PRODUCT_CATEGORIES: Record<string, { spec: string; products: ProductEntry[] }> = {
  'hf-rfid-readers': {
    spec: '13.56MHz · IO-LINK / ModbusTCP',
    products: [
      { name: 'D1338T 工业级高频网口读写器', slug: 'd1338t-hf-ethernet-reader', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_p6nq.jpg' },
      { name: 'D1609 & D1339 系列工业级高频读写器', slug: 'd1609-d1339-series', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2_yhtq.jpg' },
      { name: 'D1646T ModbusTCP 齐平式高频RFID读写器', slug: 'd1646t-modbus-tcp', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_3ji7.jpg' },
      { name: 'D1621系列 IO-LINK高频RFID读写器', slug: 'd1621-io-link', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_nuqm.jpg' },
    ],
  },
  'uhf-rfid-readers': {
    spec: '860-960MHz · Long Range',
    products: [
      { name: 'D2184B 高性能四通道UHF读写器', slug: 'd2184b-quad-channel', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184B_x6b5.jpg' },
      { name: 'D2480系列 工业超高频RFID读写器', slug: 'd2480-series', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2480B_4f8u.jpg' },
      { name: 'D2188BL 超高频多通道读写器', slug: 'd2188bl-multi-channel', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2188.jpg' },
      { name: 'D2180U 超高频桌面读写器', slug: 'd2180u-desktop', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2180U.jpg' },
    ],
  },
  'handheld-terminals': {
    spec: 'Android · Industrial Grade',
    products: [
      { name: 'M12 安卓手持终端', slug: 'm12-android-terminal', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_7bkj.jpg' },
      { name: 'M11 工业级手持终端', slug: 'm11-industrial', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11_lnf7.jpg' },
      { name: 'N60 智能打印手持终端', slug: 'n60-print-terminal', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/11_vljy.jpg' },
      { name: 'M11 工业级安卓条码手持终端', slug: 'm11-barcode', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11.png' },
    ],
  },
  'industrial-tablets': {
    spec: 'Fixed Mount · Edge Computing',
    products: [
      { name: 'P01 多功能工业平板', slug: 'p01-industrial-tablet', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_hd05.jpg' },
    ],
  },
  'portable-readers': {
    spec: 'Bluetooth · UHF Scanner',
    products: [
      { name: 'T01 蓝牙UHF扫描仪', slug: 't01-bluetooth-uhf', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_xz3s_ou59.jpg' },
      { name: 'T02 蓝牙UHF扫描仪', slug: 't02-bluetooth-uhf', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_jxgj_0wo1.jpg' },
      { name: 'T03 蓝牙UHF扫描仪', slug: 't03-bluetooth-uhf', image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/t03.png' },
    ],
  },
};

// Category icon components
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

// ── Main MegaMenu ──

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

      {/* Mega dropdown overlay */}
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

/* ────────────────────────────────────────────────
   Products: Left sidebar nav + Right image cards
   ──────────────────────────────────────────────── */

function ProductsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  const [activeCategory, setActiveCategory] = useState<string>(items[0]?.href ?? '');

  const currentKey = items.find((i) => i.href === activeCategory);
  const categorySlug = activeCategory.split('/').pop() ?? '';
  const data = PRODUCT_CATEGORIES[categorySlug];

  return (
    <div className="flex gap-8">
      {/* Left: vertical navigation sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          产品系列
        </div>
        <div className="flex flex-col border-l border-neutral-700/50">
          {items.map((item) => {
            const slug = item.href.split('/').pop() ?? '';
            const isActive = activeCategory === item.href;
            const catData = PRODUCT_CATEGORIES[slug];
            return (
              <button
                key={item.href}
                onMouseEnter={() => setActiveCategory(item.href)}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-2 -ml-px ${
                  isActive
                    ? 'border-primary-400 bg-primary-500/5 text-primary-400'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary-500/15 text-primary-400' : 'bg-neutral-700/40 text-neutral-500'
                }`}>
                  {getCategoryIcon(item.href)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{item.label}</div>
                  {catData && (
                    <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                      {catData.spec}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {/* "View all products" link */}
        <Link
          href={`/${locale}/products`}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-500 hover:text-primary-400 transition-colors rounded-lg hover:bg-neutral-800/50"
        >
          查看全部产品
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Right: image cards grid */}
      <div className="flex-1 min-w-0">
        {data ? (
          <>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
              {currentKey?.label}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {data.products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/${locale}/products/${product.slug}`}
                  className="group rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/40 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
                >
                  <div className="aspect-[4/3] bg-neutral-800 overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <div className="text-[12px] font-medium text-white group-hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                      {product.name}
                    </div>
                  </div>
                </Link>
              ))}
              {/* More products card */}
              <Link
                href={`/${locale}${currentKey?.href ?? '/products'}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700/50 bg-neutral-800/20 hover:border-primary-500/30 hover:bg-neutral-800/40 transition-all duration-300 min-h-[180px]"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-700/40 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-colors">
                  <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <span className="text-xs text-neutral-500 group-hover:text-primary-400 transition-colors font-medium">
                  查看全部
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[200px] text-neutral-500 text-sm">
            加载中...
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Applications: Left sidebar nav + Right image cards
   ──────────────────────────────────────────────── */

type ApplicationEntry = { title: string; image: string };

const APPLICATION_CATEGORIES: Record<string, ApplicationEntry> = {
  '智能智造': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_0cw9.jpg',
    title: '智能智造',
  },
  '仓储物流': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png',
    title: '仓储物流',
  },
  '档案图书': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp',
    title: '档案图书',
  },
  '资产巡检': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_5oov_u61r.jpg',
    title: '资产巡检',
  },
  '防伪追溯': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458614250_kwa3.jpg',
    title: '防伪追溯',
  },
  '零售与供应链': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg',
    title: '零售与供应链',
  },
  '智慧城市': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/jucg.png',
    title: '智慧城市',
  },
  '智能柜体': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458617833_oq6g.jpg',
    title: '智能柜体',
  },
};

function getAppIcon(label: string): React.ReactNode {
  if (label.includes('智造') || label.includes('物流') || label.includes('零售')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    );
  }
  if (label.includes('城市')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ApplicationsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  const [activeLabel, setActiveLabel] = useState<string>(items[0]?.label ?? '');

  const appData = APPLICATION_CATEGORIES[activeLabel] || APPLICATION_CATEGORIES[items[0]?.label ?? ''];

  return (
    <div className="flex gap-8">
      {/* Left: vertical navigation sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          行业应用
        </div>
        <div className="flex flex-col border-l border-neutral-700/50">
          {items.map((item) => {
            const isActive = activeLabel === item.label;
            return (
              <button
                key={item.label}
                onMouseEnter={() => setActiveLabel(item.label)}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-2 -ml-px ${
                  isActive
                    ? 'border-primary-400 bg-primary-500/5 text-primary-400'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary-500/15 text-primary-400' : 'bg-neutral-700/40 text-neutral-500'
                }`}>
                  {getAppIcon(item.label)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{item.label}</div>
                </div>
              </button>
            );
          })}
        </div>
        <Link
          href={`/${locale}/applications`}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-500 hover:text-primary-400 transition-colors rounded-lg hover:bg-neutral-800/50"
        >
          查看全部应用
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Right: image cards grid */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          {activeLabel}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Featured large card */}
          <Link
            href={`/${locale}/applications`}
            className="group rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/40 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 col-span-1 row-span-2"
          >
            <div className="aspect-[3/4] bg-neutral-800 overflow-hidden relative">
              <img
                src={appData.image}
                alt={appData.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-sm font-semibold text-white">{appData.title}</div>
                <div className="text-xs text-neutral-300 mt-1">RFID智能解决方案</div>
              </div>
            </div>
          </Link>

          {/* Secondary cards */}
          <Link
            href={`/${locale}/applications`}
            className="group rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/40 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="aspect-video bg-neutral-800 overflow-hidden relative">
              <img
                src="https://pmtdb1c40-pic17.websiteonline.cn/upload/4.webp"
                alt="RFID技术应用"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-[12px] font-medium text-white line-clamp-2">RFID技术应用场景</div>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/applications`}
            className="group rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/40 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="aspect-video bg-neutral-800 overflow-hidden relative">
              <img
                src="https://pmtdb1c40-pic17.websiteonline.cn/upload/1458629182_l5g8.jpg"
                alt="工业自动化"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-[12px] font-medium text-white line-clamp-2">工业自动化追溯</div>
              </div>
            </div>
          </Link>

          <Link
            href={`/${locale}/applications`}
            className="group rounded-xl overflow-hidden border border-neutral-700/50 bg-neutral-800/40 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
          >
            <div className="aspect-video bg-neutral-800 overflow-hidden relative">
              <img
                src="https://pmtdb1c40-pic17.websiteonline.cn/upload/1458629447_ihj4.jpg"
                alt="供应链管理"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-[12px] font-medium text-white line-clamp-2">供应链数字化管理</div>
              </div>
            </div>
          </Link>

          {/* View all card */}
          <Link
            href={`/${locale}/applications`}
            className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700/50 bg-neutral-800/20 hover:border-primary-500/30 hover:bg-neutral-800/40 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700/40 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-colors">
              <svg className="w-5 h-5 text-neutral-500 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <span className="text-xs text-neutral-500 group-hover:text-primary-400 transition-colors font-medium">
              查看全部方案
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Support: 4-column compact
   ──────────────────────────────────────────────── */

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
