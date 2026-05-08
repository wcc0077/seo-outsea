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

// Sub-category slugs for each top-level product group
const PRODUCT_SUB_CATEGORIES: Record<string, string[]> = {
  'smart-mobile-terminals': ['handheld-terminals', 'industrial-tablets', 'portable-readers'],
  'rfid-readers': ['hf-rfid-readers', 'uhf-rfid-readers'],
  'rfid-tags': [], // RFID tags page handles this separately
};

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

  function handleClick(href: string) {
    if (activeKey === href) {
      setActiveKey(null);
    } else {
      clearTimer();
      setActiveKey(href);
    }
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
              className={`text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-400 after:transition-all hover:after:w-full cursor-pointer ${
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
            ) : activeNavItem.href === '/about' ? (
              <AboutMegaMenu items={activeNavItem.children} locale={locale} />
            ) : activeNavItem.href === '/support' ? (
              <SupportMegaMenu items={activeNavItem.children} locale={locale} />
            ) : (
              <SimpleMegaMenu items={activeNavItem.children} locale={locale} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ────────────────────────────────────────────────
   Products: 3-column layout with sub-category cards
   ──────────────────────────────────────────────── */

function ProductsMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  const [activeSlug, setActiveSlug] = useState<string>('smart-mobile-terminals');

  const navToSlug = (label: string): string => {
    const lower = label.toLowerCase();
    if (lower.includes('smart mobile') || lower.includes('移动终端')) return 'smart-mobile-terminals';
    if (lower.includes('rfid reader') || lower.includes('读写器')) return 'rfid-readers';
    if (lower.includes('rfid tag') || lower.includes('标签')) return 'rfid-tags';
    return '';
  };

  const subSlugs = PRODUCT_SUB_CATEGORIES[activeSlug] || [];
  const activeProducts: { product: ProductEntry; category: string }[] = [];
  for (const sub of subSlugs) {
    for (const product of (PRODUCT_CATEGORIES[sub]?.products ?? [])) {
      activeProducts.push({ product, category: sub });
    }
  }

  return (
    <div className="flex gap-8">
      {/* Left sidebar */}
      <div className="w-56 flex-shrink-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          产品系列
        </div>
        <div className="flex flex-col border-l border-neutral-700/50">
          {items.map((item) => {
            const slug = navToSlug(item.label);
            const isActive = slug === activeSlug;
            return (
              <Link
                key={item.label}
                href={`/${locale}${item.href}`}
                onMouseEnter={() => setActiveSlug(slug)}
                className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-2 -ml-px ${
                  isActive
                    ? 'border-primary-400 bg-primary-500/5 text-primary-400'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary-500/15 text-primary-400' : 'bg-neutral-700/40 text-neutral-500'
                }`}>
                  {getCategoryIcon(slug)}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{item.label}</div>
                </div>
              </Link>
            );
          })}
        </div>
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

      {/* Right: featured products grid */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          热门产品
        </div>
        {activeSlug === 'rfid-tags' ? (
          <div className="flex items-center justify-center h-64 text-neutral-500 text-sm">
            <Link href={`/${locale}/rfid-tags`} className="text-primary-400 hover:underline">
              前往 RFID 标签页面 →
            </Link>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-neutral-500 text-sm">暂无产品</div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {activeProducts.map(({ product, category }) => (
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
  '连锁零售': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg',
    title: '连锁零售',
  },
  '智慧城市': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/jucg.png',
    title: '智慧城市',
  },
  '智能柜体': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458617833_oq6g.jpg',
    title: '智能柜体',
  },
  'Smart Manufacturing': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_0cw9.jpg',
    title: 'Smart Manufacturing',
  },
  'Warehouse & Logistics': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png',
    title: 'Warehouse & Logistics',
  },
  'Archive & Library': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp',
    title: 'Archive & Library',
  },
  'Asset Inspection': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_5oov_u61r.jpg',
    title: 'Asset Inspection',
  },
  'Anti-counterfeit & Traceability': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458614250_kwa3.jpg',
    title: 'Anti-counterfeit & Traceability',
  },
  'Retail & Supply Chain': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg',
    title: 'Retail & Supply Chain',
  },
  'Smart City': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/jucg.png',
    title: 'Smart City',
  },
  'Smart Cabinet': {
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458617833_oq6g.jpg',
    title: 'Smart Cabinet',
  },
};

function getAppIcon(label: string): React.ReactNode {
  if (
    label.includes('智造') || label.includes('物流') || label.includes('零售') ||
    label.includes('Manufacturing') || label.includes('Logistics') || label.includes('Retail')
  ) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    );
  }
  if (label.includes('城市') || label.includes('City')) {
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

  const appData = APPLICATION_CATEGORIES[activeLabel] || Object.values(APPLICATION_CATEGORIES)[0];

  const allOthers = items
    .filter((item) => item.label !== activeLabel)
    .map((item) => ({
      item,
      entry: APPLICATION_CATEGORIES[item.label] || Object.values(APPLICATION_CATEGORIES)[0],
    }));

  const leftCard = allOthers[0];
  const rightCards = allOthers.slice(1, 4);

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
      </div>

      {/* Right: image cards grid */}
      <div className="flex-1 min-w-0 self-start">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">
          {activeLabel}
        </div>
        <div className="flex gap-4" style={{ height: '420px' }}>
          {/* Left column: featured + 1 */}
          <div className="w-1/2 flex flex-col gap-3">
            {/* Featured card */}
            <Link
              href={`/${locale}/applications`}
              className="group flex-[3] relative rounded-2xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 min-h-0"
            >
              <img
                src={appData.image}
                alt={appData.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
                    Featured
                  </span>
                </div>
                <div className="text-base font-bold text-white">{appData.title}</div>
                <div className="text-xs text-neutral-400 mt-1">RFID智能解决方案</div>
              </div>
            </Link>

            {/* Secondary card */}
            {leftCard && (
              <Link
                href={`/${locale}/applications`}
                className="group flex-1 relative rounded-xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 min-h-0"
              >
                <img
                  src={leftCard.entry.image}
                  alt={leftCard.entry.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-[12px] font-medium text-white/90">{leftCard.entry.title}</div>
                </div>
              </Link>
            )}
          </div>

          {/* Right column: 3 cards */}
          <div className="w-1/2 flex flex-col gap-3">
            {rightCards.map((card, idx) => (
              <Link
                key={card.item.label}
                href={`/${locale}/applications`}
                className={`group flex-1 relative rounded-xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 min-h-0 ${
                  idx === 0 ? 'hover:ring-1 hover:ring-primary-500/20' : ''
                }`}
              >
                <img
                  src={card.entry.image}
                  alt={card.entry.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent" />
                <div className="absolute inset-0 flex items-start p-3">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-neutral-300/80 bg-neutral-900/60 backdrop-blur-sm rounded-md border border-neutral-600/30">
                    {card.entry.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   About: 4-column with large hero area
   ──────────────────────────────────────────────── */

const ABOUT_CARDS = [
  {
    key: 'intro',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Company Overview',
    cn: '上海孚恩电子科技有限公司',
  },
  {
    key: 'company',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    description: 'Facility Photos',
    cn: '公司实景',
  },
  {
    key: 'history',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Development Timeline',
    cn: '发展历程',
  },
  {
    key: 'honors',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    description: 'Honors & Certifications',
    cn: '荣誉资质',
  },
];

function AboutMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => {
        const slug = item.href.split('/').pop() ?? '';
        const card = ABOUT_CARDS.find((c) => c.key === slug);
        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="group relative rounded-2xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 p-6 flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-primary-500/15 group-hover:scale-110 transition-all duration-300">
              {card?.icon}
            </div>
            <div className="text-[15px] font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
              {item.label}
            </div>
            <div className="text-xs text-neutral-400">
              {card?.description}
            </div>
            {card?.cn && locale === 'zh' && (
              <div className="text-[10px] text-neutral-500 mt-1.5">
                {card.cn}
              </div>
            )}
          </Link>
        );
      })}
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
          key={item.label}
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

/* ────────────────────────────────────────────────
   Simple: basic 2-column grid for simple dropdowns
   ──────────────────────────────────────────────── */

function SimpleMegaMenu({ items, locale }: { items: NonNullable<NavItem['children']>; locale: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className="group rounded-xl border border-neutral-700/50 bg-neutral-800/60 p-4 hover:border-primary-500/40 hover:bg-neutral-800 transition-all duration-300"
        >
          <span className="text-[13px] font-semibold text-white group-hover:text-primary-400 transition-colors">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
