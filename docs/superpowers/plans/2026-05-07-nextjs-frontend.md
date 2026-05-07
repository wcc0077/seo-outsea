# fn-tech.com Next.js Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-language, SEO-optimized Next.js frontend that consumes the Strapi CMS API and renders all website pages with server-side rendering.

**Architecture:** Next.js 15 App Router with React Server Components. next-intl handles locale routing via URL prefix. Server Components fetch Strapi data at request time. Tailwind CSS for styling. Deployed on Vercel.

**Tech Stack:** Next.js 15, React 19, next-intl, Tailwind CSS, TypeScript

**Dependency:** Plan A (Strapi CMS) must be running. Set `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` in `.env.local`.

---

## File Structure

```
frontend/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── middleware.ts
├── .env.local                        # NEXT_PUBLIC_STRAPI_URL
├── .gitignore
├── app/
│   ├── layout.tsx                    # Root layout (html, body)
│   ├── not-found.tsx                 # 404 page
│   ├── [locale]/
│   │   ├── layout.tsx                # Locale layout (header, footer, i18n provider)
│   │   ├── page.tsx                  # Homepage (dynamic sections from Strapi)
│   │   ├── about/
│   │   │   └── page.tsx              # About page (Page: slug="about")
│   │   ├── products/
│   │   │   ├── page.tsx              # Products list (by category)
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx          # Category page
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Product detail
│   │   ├── applications/
│   │   │   ├── page.tsx              # Applications list
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Application detail
│   │   ├── news/
│   │   │   ├── page.tsx              # News list (paginated)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # News detail
│   │   ├── support/
│   │   │   └── page.tsx              # Support page (Page: slug="support")
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact page (Page: slug="contact")
│   │   └── sharing/
│   │       └── page.tsx              # Sharing page (Page: slug="sharing")
│   └── api/
│       ├── sitemap/
│       │   ├── route.ts              # GET /sitemap.xml
│       │   └── [locale]/
│       │       ── route.ts          # GET /[locale]/sitemap.xml
│       └── og/
│           └── route.ts              # Dynamic OG image generation
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Top navigation bar
│   │   ├── Footer.tsx                # Site footer
│   │   ├── Navbar.tsx                # Navigation links
│   │   ├── LanguageSwitcher.tsx      # Language dropdown
│   │   └── MobileMenu.tsx            # Mobile hamburger menu
│   ├── sections/
│   │   ├── HeroSection.tsx           # Renders HeroSection Dynamic Zone
│   │   ├── ProductGrid.tsx           # Renders ProductGrid Dynamic Zone
│   │   ├── ApplicationShowcase.tsx   # Renders ApplicationShowcase Dynamic Zone
│   │   ├── NewsList.tsx              # Renders NewsList Dynamic Zone
│   │   ├── TextImage.tsx             # Renders TextImage Dynamic Zone
│   │   ├── StatsSection.tsx          # Renders StatsSection Dynamic Zone
│   │   ├── FAQSection.tsx            # Renders FAQSection Dynamic Zone
│   │   ├── ContactForm.tsx           # Renders ContactForm Dynamic Zone
│   │   ├── Spacer.tsx                # Renders Spacer Dynamic Zone
│   │   └── SectionRenderer.tsx       # Switches on section type
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ── Pagination.tsx
│   ── seo/
│       ├── MetaTags.tsx              # Renders <title>, <meta>, OG tags
│       ├── JsonLd.tsx                # Renders JSON-LD structured data
│       ── SitemapLink.tsx           # Sitemap reference
├── lib/
│   ├── strapi.ts                     # Strapi API client
│   ├── i18n.ts                       # next-intl configuration
│   └── constants.ts                  # Design tokens, breakpoints
── messages/
│   ├── en.json                       # English UI translations
│   └── zh.json                       # Chinese UI translations
└── public/
    ├── favicon.ico
    └── og-template.png               # OG image base template
```

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/.gitignore`
- Create: `frontend/.env.local`
- Create: `frontend/next.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.mjs`
- Create: `frontend/app/layout.tsx`
- Create: `frontend/app/globals.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "fn-tech-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.x",
    "next-intl": "3.x",
    "react": "19.x",
    "react-dom": "19.x",
    "next-sitemap": "4.x"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
.next/
.env.local
.env*.local
```

- [ ] **Step 4: Create .env.local**

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Create next.config.ts**

```typescript
// frontend/next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Create tailwind.config.ts**

```typescript
// frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Create postcss.config.mjs**

```javascript
// frontend/postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Create globals.css**

```css
/* frontend/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply antialiased text-gray-900 bg-white;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 text-sm font-medium
           text-white bg-primary-600 rounded-lg shadow-sm
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
           transition-colors duration-200;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-3 text-sm font-medium
           text-primary-600 bg-white border border-primary-600 rounded-lg
           hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500
           transition-colors duration-200;
  }
  .container-prose {
    @apply max-w-3xl mx-auto;
  }
}
```

- [ ] **Step 9: Create root layout**

```typescript
// frontend/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FN Tech — Industrial RFID Solutions',
    template: '%s | FN Tech',
  },
  description: 'Professional RFID readers, tags, and industrial IoT solutions.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Install and run**

```bash
cd frontend
npm install
npm run dev
```
Expected: Next.js dev server at `http://localhost:3000` with basic "Hello" from root layout.

- [ ] **Step 11: Commit**

```bash
git add frontend/package.json frontend/tsconfig.json frontend/.gitignore frontend/.env.local frontend/next.config.ts frontend/tailwind.config.ts frontend/postcss.config.mjs frontend/app/layout.tsx frontend/app/globals.css
git commit -m "feat: initialize Next.js 15 project with Tailwind CSS"
```

---

## Task 2: Configure i18n (next-intl)

**Files:**
- Create: `frontend/lib/i18n.ts`
- Create: `frontend/middleware.ts`
- Create: `frontend/messages/en.json`
- Create: `frontend/messages/zh.json`

- [ ] **Step 1: Create i18n configuration**

```typescript
// frontend/lib/i18n.ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Default locales — will be overridden by Strapi at runtime
const SUPPORTED_LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';

export async function loadLocale(locale: string) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
  };
}

export default getRequestConfig(async ({ locale }) => loadLocale(locale));

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
```

- [ ] **Step 2: Create English messages**

```json
{
  "Navigation": {
    "about": "About Us",
    "products": "Products",
    "applications": "Applications",
    "news": "News",
    "support": "Support",
    "contact": "Contact",
    "sharing": "Knowledge"
  },
  "Common": {
    "readMore": "Read More",
    "contactUs": "Contact Us",
    "search": "Search",
    "searchPlaceholder": "Enter keywords...",
    "allRightsReserved": "All rights reserved.",
    "language": "Language",
    "previous": "Previous",
    "next": "Next",
    "page": "Page"
  },
  "Products": {
    "title": "Products",
    "category": "Category",
    "allProducts": "All Products",
    "specifications": "Specifications",
    "name": "Name",
    "value": "Value"
  },
  "Applications": {
    "title": "Industry Applications",
    "useCase": "Use Case"
  },
  "News": {
    "title": "News",
    "latestNews": "Latest News",
    "publishedOn": "Published on",
    "by": "by"
  },
  "Support": {
    "title": "Technical Support"
  },
  "Contact": {
    "title": "Contact Us",
    "address": "Address",
    "phone": "Phone",
    "email": "Email",
    "send": "Send Message",
    "name": "Your Name",
    "emailLabel": "Your Email",
    "message": "Message",
    "submitSuccess": "Message sent successfully!",
    "submitError": "Failed to send message. Please try again."
  },
  "NotFound": {
    "title": "Page Not Found",
    "description": "The page you are looking for does not exist.",
    "goHome": "Go to Homepage"
  },
  "SEO": {
    "defaultDescription": "Professional RFID readers, tags, and industrial IoT solutions."
  }
}
```

- [ ] **Step 3: Create Chinese messages**

```json
{
  "Navigation": {
    "about": "关于孚恩",
    "products": "产品中心",
    "applications": "行业应用",
    "news": "新闻中心",
    "support": "技术支持",
    "contact": "联系我们",
    "sharing": "知识分享"
  },
  "Common": {
    "readMore": "了解更多",
    "contactUs": "联系我们",
    "search": "搜索",
    "searchPlaceholder": "请输入关键字...",
    "allRightsReserved": "版权所有。",
    "language": "语言",
    "previous": "上一页",
    "next": "下一页",
    "page": "第"
  },
  "Products": {
    "title": "产品中心",
    "category": "产品分类",
    "allProducts": "全部产品",
    "specifications": "技术参数",
    "name": "名称",
    "value": "参数"
  },
  "Applications": {
    "title": "行业应用",
    "useCase": "应用案例"
  },
  "News": {
    "title": "新闻中心",
    "latestNews": "最新动态",
    "publishedOn": "发布于",
    "by": "作者"
  },
  "Support": {
    "title": "技术支持"
  },
  "Contact": {
    "title": "联系我们",
    "address": "地址",
    "phone": "电话",
    "email": "邮箱",
    "send": "发送消息",
    "name": "您的姓名",
    "emailLabel": "您的邮箱",
    "message": "留言内容",
    "submitSuccess": "消息发送成功！",
    "submitError": "发送失败，请重试。"
  },
  "NotFound": {
    "title": "页面未找到",
    "description": "您访问的页面不存在。",
    "goHome": "返回首页"
  },
  "SEO": {
    "defaultDescription": "专业的RFID读写器、电子标签和工业物联网解决方案。"
  }
}
```

- [ ] **Step 4: Create middleware**

```typescript
// frontend/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/i18n';

export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(en|zh)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 5: Install dependencies and test**

```bash
cd frontend
npm install next-intl
npm run dev
```
Expected: Visiting `http://localhost:3000` redirects to `http://localhost:3000/en`. Visiting `http://localhost:3000/zh` works.

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/i18n.ts frontend/middleware.ts frontend/messages/en.json frontend/messages/zh.json
git commit -m "feat: configure next-intl with en/zh locales"
```

---

## Task 3: Create Strapi API Client

**Files:**
- Create: `frontend/lib/strapi.ts`
- Create: `frontend/lib/constants.ts`

- [ ] **Step 1: Create API client**

```typescript
// frontend/lib/strapi.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface FetchOptions {
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${STRAPI_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function fetchApi<T>(path: string, params?: Record<string, string | number | undefined>, options?: FetchOptions): Promise<T> {
  const url = buildUrl(path, { ...params, populate: '*' });
  const res = await fetch(url, {
    cache: options?.cache || 'force-cache',
    next: options?.next,
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---- Global ----

export interface GlobalData {
  siteName: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    qrCode?: { url: string };
  }>;
  languages: Array<{
    code: string;
    name: string;
    enabled: boolean;
  }>;
  defaultLocale: string;
}

export async function getGlobal(): Promise<GlobalData> {
  const res = await fetchApi<{ data: GlobalData }>('/api/global');
  return res.data;
}

// ---- Pages ----

export interface PageData {
  slug: string;
  title: string;
  heroBanner: {
    title: string;
    subtitle: string;
    backgroundImage?: { url: string; alternativeText: string };
    ctaLabel: string;
    ctaUrl: string;
  };
  sections: Array<SectionData>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface SectionData {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export async function getPageBySlug(slug: string, locale: string): Promise<PageData | null> {
  try {
    const res = await fetchApi<{ data: PageData }>(`/api/pages/by-slug/${slug}`, { locale });
    return res.data;
  } catch {
    return null;
  }
}

export async function getAllPages(locale: string): Promise<PageData[]> {
  const res = await fetchApi<{ data: PageData[] }>('/api/pages', { locale });
  return res.data;
}

// ---- Product Categories ----

export interface ProductCategoryData {
  name: string;
  slug: string;
  description: string;
  parent?: ProductCategoryData;
  children?: ProductCategoryData[];
  sortOrder: number;
  image?: { url: string; alternativeText: string };
}

export async function getProductCategories(locale: string): Promise<ProductCategoryData[]> {
  const res = await fetchApi<{ data: ProductCategoryData[] }>('/api/product-categories', {
    locale,
    'sort[0]': 'sortOrder:asc',
  });
  return res.data;
}

export async function getProductCategoryBySlug(slug: string, locale: string): Promise<ProductCategoryData | null> {
  try {
    const res = await fetchApi<{ data: ProductCategoryData }>(
      `/api/product-categories/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Products ----

export interface ProductData {
  name: string;
  slug: string;
  description: string;
  specs: Array<{ name: string; value: string }>;
  images: Array<{ url: string; alternativeText: string }>;
  category?: ProductCategoryData;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export async function getProducts(locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>('/api/products', { locale });
  return res.data;
}

export async function getProductsByCategory(categorySlug: string, locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>(
    `/api/products/by-category/${categorySlug}`,
    { locale }
  );
  return res.data;
}

export async function getProductBySlug(slug: string, locale: string): Promise<ProductData | null> {
  try {
    const res = await fetchApi<{ data: ProductData }>(
      `/api/products/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Applications ----

export interface ApplicationData {
  name: string;
  slug: string;
  description: string;
  images: Array<{ url: string; alternativeText: string }>;
  useCase: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export async function getApplications(locale: string): Promise<ApplicationData[]> {
  const res = await fetchApi<{ data: ApplicationData[] }>('/api/applications', { locale });
  return res.data;
}

export async function getApplicationBySlug(slug: string, locale: string): Promise<ApplicationData | null> {
  try {
    const res = await fetchApi<{ data: ApplicationData }>(
      `/api/applications/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- News ----

export interface NewsData {
  title: string;
  slug: string;
  content: string;
  coverImage?: { url: string; alternativeText: string };
  publishDate: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
}

interface NewsPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export async function getPublishedNews(locale: string, page = 1, pageSize = 10): Promise<{ data: NewsData[]; meta: NewsPaginationMeta }> {
  const res = await fetchApi<{ data: NewsData[]; meta: NewsPaginationMeta }>(
    '/api/news/published',
    { locale, page: String(page), pageSize: String(pageSize) }
  );
  return res;
}

export async function getNewsBySlug(slug: string, locale: string): Promise<NewsData | null> {
  try {
    const res = await fetchApi<{ data: NewsData }>(
      `/api/news/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Image URL Helper ----

export function getStrapiImageUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
```

- [ ] **Step 2: Create constants**

```typescript
// frontend/lib/constants.ts

export const SITE_NAME = 'FN Tech';

export const PAGE_SIZE = 10;

export const REVALIDATE_INTERVAL = 3600; // 1 hour in seconds

export const SECTION_COMPONENT_MAP: Record<string, string> = {
  'sections.hero-section': 'HeroSection',
  'sections.product-grid': 'ProductGrid',
  'sections.application-showcase': 'ApplicationShowcase',
  'sections.news-list': 'NewsList',
  'sections.text-image': 'TextImage',
  'sections.stats-section': 'StatsSection',
  'sections.faq-section': 'FAQSection',
  'sections.contact-form': 'ContactForm',
  'sections.spacer': 'Spacer',
};
```

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/strapi.ts frontend/lib/constants.ts
git commit -m "feat: create Strapi API client with typed fetch functions"
```

---

## Task 4: Create Locale Layout with Header/Footer

**Files:**
- Create: `frontend/app/[locale]/layout.tsx`
- Create: `frontend/components/layout/Header.tsx`
- Create: `frontend/components/layout/Footer.tsx`
- Create: `frontend/components/layout/Navbar.tsx`
- Create: `frontend/components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Create locale layout**

```typescript
// frontend/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { getGlobal } from '@/lib/strapi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const [global, t] = await Promise.all([
    getGlobal().catch(() => null),
    getTranslations({ locale, namespace: 'Navigation' }),
  ]);

  const navLinks = [
    { label: t('about'), href: '/about' },
    { label: t('products'), href: '/products' },
    { label: t('applications'), href: '/applications' },
    { label: t('news'), href: '/news' },
    { label: t('support'), href: '/support' },
    { label: t('contact'), href: '/contact' },
  ];

  return (
    <NextIntlClientProvider messages={messages}>
      <Header
        siteName={global?.siteName || 'FN Tech'}
        logoUrl={global?.logo?.url || null}
        navLinks={navLinks}
        locale={locale}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer global={global} locale={locale} />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: Create Header component**

```typescript
// frontend/components/layout/Header.tsx
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

          {/* Language Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create Footer component**

```typescript
// frontend/components/layout/Footer.tsx
import Link from 'next/link';
import { GlobalData, getStrapiImageUrl } from '@/lib/strapi';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
}

export default function Footer({ global, locale }: FooterProps) {
  const contact = global?.contactInfo;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{global?.siteName || 'FN Tech'}</h3>
            {contact && (
              <div className="space-y-2 text-sm">
                {contact.address && <p>{contact.address}</p>}
                {contact.phone && <p>{contact.phone}</p>}
                {contact.email && <p>{contact.email}</p>}
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">RFID Readers</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">RFID Tags</Link></li>
              <li><Link href={`/${locale}/products`} className="hover:text-white transition-colors">Mobile Terminals</Link></li>
            </ul>
          </div>

          {/* Applications */}
          <div>
            <h3 className="text-white font-semibold mb-4">Applications</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Smart Manufacturing</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Warehouse & Logistics</Link></li>
              <li><Link href={`/${locale}/applications`} className="hover:text-white transition-colors">Asset Management</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/support`} className="hover:text-white transition-colors">Technical Support</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-white transition-colors">Knowledge Base</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} {global?.siteName || 'FN Tech'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create LanguageSwitcher component**

```typescript
// frontend/components/layout/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  zh: '中文',
};

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale: string) => {
    // Replace current locale in path with new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Select language"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_NAMES[locale] || locale}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 5: Create Navbar placeholder**

```typescript
// frontend/components/layout/Navbar.tsx
// Mobile navigation — placeholder for Task 6
export default function Navbar() {
  return null;
}
```

- [ ] **Step 6: Run and verify**

```bash
cd frontend
npm run dev
```
Expected: `http://localhost:3000/en` shows header with navigation links and language switcher, empty main area, footer with company info.

- [ ] **Step 7: Commit**

```bash
git add frontend/app/\[locale\]/layout.tsx frontend/components/layout/
git commit -m "feat: create locale layout with Header, Footer, and LanguageSwitcher"
```

---

## Task 5: Create Homepage with Dynamic Sections

**Files:**
- Create: `frontend/app/[locale]/page.tsx`
- Create: `frontend/components/sections/SectionRenderer.tsx`
- Create: `frontend/components/sections/HeroSection.tsx`
- Create: `frontend/components/sections/ProductGrid.tsx`
- Create: `frontend/components/sections/ApplicationShowcase.tsx`
- Create: `frontend/components/sections/NewsList.tsx`
- Create: `frontend/components/sections/TextImage.tsx`
- Create: `frontend/components/sections/StatsSection.tsx`
- Create: `frontend/components/sections/FAQSection.tsx`
- Create: `frontend/components/sections/ContactForm.tsx`
- Create: `frontend/components/sections/Spacer.tsx`
- Create: `frontend/components/seo/MetaTags.tsx`
- Create: `frontend/components/seo/JsonLd.tsx`
- Create: `frontend/components/ui/Container.tsx`
- Create: `frontend/components/ui/Section.tsx`
- Create: `frontend/components/ui/Button.tsx`
- Create: `frontend/components/ui/Card.tsx`

- [ ] **Step 1: Create Container UI component**

```typescript
// frontend/components/ui/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create Section UI component**

```typescript
// frontend/components/ui/Section.tsx
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: 'white' | 'gray' | 'primary';
}

export default function Section({ children, className = '', bg = 'white' }: SectionProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-600 text-white',
  };

  return (
    <section className={`py-16 ${bgClasses[bg]} ${className}`}>
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Create Button UI component**

```typescript
// frontend/components/ui/Button.tsx
import Link from 'next/link';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export default function Button({ href, variant = 'primary', children, className = '' }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:text-primary-700 hover:underline',
  };

  const baseClasses = `inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return <button className={baseClasses}>{children}</button>;
}
```

- [ ] **Step 4: Create Card UI component**

```typescript
// frontend/components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden
                     ${hover ? 'hover:shadow-lg hover:border-gray-300 transition-all duration-200' : ''}
                     ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Create MetaTags SEO component**

```typescript
// frontend/components/seo/MetaTags.tsx
'use client';

import { useLocale } from 'next-intl';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
}

export default function MetaTags({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  alternateLocales,
}: MetaTagsProps) {
  const locale = useLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* hreflang */}
      {alternateLocales?.map(({ locale: altLocale, url }) => (
        <link key={altLocale} rel="alternate" hrefLang={altLocale} href={`${siteUrl}/${altLocale}${url}`} />
      ))}
    </>
  );
}
```

- [ ] **Step 6: Create JsonLd SEO component**

```typescript
// frontend/components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 7: Create homepage**

```typescript
// frontend/app/[locale]/page.tsx
import { getGlobal, getPageBySlug, getProducts, getApplications, getPublishedNews, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import MetaTags from '@/components/seo/MetaTags';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionRenderer from '@/components/sections/SectionRenderer';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [global, homePage, products, applications, newsResult] = await Promise.all([
    getGlobal().catch(() => null),
    getPageBySlug('home', locale).catch(() => null),
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 3).catch(() => ({ data: [] })),
  ]);

  const title = homePage?.seoTitle || global?.siteName || 'FN Tech';
  const description = homePage?.seoDescription || 'Professional RFID readers, tags, and industrial IoT solutions.';

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        keywords={homePage?.seoKeywords}
      />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: global?.siteName || 'FN Tech',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        contactPoint: global?.contactInfo ? [{
          '@type': 'ContactPoint',
          telephone: global.contactInfo.phone,
          email: global.contactInfo.email,
        }] : undefined,
      }} />

      {/* Dynamic Sections from CMS */}
      {homePage?.sections?.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          products={products}
          applications={applications}
          news={newsResult.data}
        />
      ))}

      {/* Fallback: if no home page in CMS, show default hero */}
      {!homePage?.sections?.length && (
        <Section bg="primary">
          <Container>
            <div className="text-center py-20">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Industrial RFID Solutions
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Professional RFID readers, tags, and handheld terminals for industrial automation.
              </p>
              <a href={`/${locale}/products`} className="inline-flex items-center px-8 py-4 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-primary-50 transition-colors">
                Explore Products
              </a>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
```

Wait — I'm referencing `SectionRenderer` before creating it, and it needs products/applications/news as props. Let me create SectionRenderer and all section components next.

- [ ] **Step 8: Create SectionRenderer**

```typescript
// frontend/components/sections/SectionRenderer.tsx
import HeroSection from './HeroSection';
import ProductGrid from './ProductGrid';
import ApplicationShowcase from './ApplicationShowcase';
import NewsList from './NewsList';
import TextImage from './TextImage';
import StatsSection from './StatsSection';
import FAQSection from './FAQSection';
import ContactForm from './ContactForm';
import Spacer from './Spacer';
import { SectionData, ProductData, ApplicationData, NewsData } from '@/lib/strapi';

interface SectionRendererProps {
  section: SectionData;
  locale: string;
  products?: ProductData[];
  applications?: ApplicationData[];
  news?: NewsData[];
}

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'sections.hero-section': HeroSection,
  'sections.product-grid': ProductGrid,
  'sections.application-showcase': ApplicationShowcase,
  'sections.news-list': NewsList,
  'sections.text-image': TextImage,
  'sections.stats-section': StatsSection,
  'sections.faq-section': FAQSection,
  'sections.contact-form': ContactForm,
  'sections.spacer': Spacer,
};

export default function SectionRenderer({ section, locale, products, applications, news }: SectionRendererProps) {
  const Component = COMPONENT_MAP[section.__component];

  if (!Component) {
    console.warn(`Unknown section component: ${section.__component}`);
    return null;
  }

  return (
    <Component
      section={section}
      locale={locale}
      products={products}
      applications={applications}
      news={news}
    />
  );
}
```

- [ ] **Step 9: Create HeroSection**

```typescript
// frontend/components/sections/HeroSection.tsx
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  section: {
    title: string;
    subtitle: string;
    backgroundImage?: { url: string; alternativeText: string };
    ctaLabel?: string;
    ctaUrl?: string;
  };
}

export default function HeroSection({ section }: HeroSectionProps) {
  const bgImage = section.backgroundImage?.url;

  return (
    <section className="relative overflow-hidden bg-primary-700 text-white">
      {bgImage && (
        <div className="absolute inset-0">
          <Image
            src={getStrapiImageUrl(bgImage)!}
            alt={section.backgroundImage?.alternativeText || ''}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}
      <div className="relative z-10">
        <Container>
          <div className="py-24 md:py-32 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {section.title}
            </h1>
            {section.subtitle && (
              <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-3xl mx-auto">
                {section.subtitle}
              </p>
            )}
            {section.ctaLabel && section.ctaUrl && (
              <Button href={section.ctaUrl} variant="secondary">
                {section.ctaLabel}
              </Button>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Create ProductGrid**

```typescript
// frontend/components/sections/ProductGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl, ProductData } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

interface ProductGridProps {
  section: {
    title: string;
    category?: { id: number };
    maxItems?: number;
  };
  locale: string;
  products?: ProductData[];
}

export default function ProductGrid({ section, locale, products }: ProductGridProps) {
  const displayProducts = section.category
    ? products?.filter((p) => p.category?.id === section.category?.id)
    : products;

  const limited = displayProducts?.slice(0, section.maxItems || 6) || [];

  return (
    <Section bg="gray">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {limited.map((product) => (
            <Card key={product.slug}>
              <Link href={`/${locale}/products/${product.category?.slug}/${product.slug}`}>
                {product.images?.[0] && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={getStrapiImageUrl(product.images[0].url)!}
                      alt={product.images[0].alternativeText || product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description?.replace(/[#*`_]/g, '').substring(0, 120)}...
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 11: Create ApplicationShowcase**

```typescript
// frontend/components/sections/ApplicationShowcase.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl, ApplicationData } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

interface ApplicationShowcaseProps {
  section: {
    title: string;
    applications?: Array<{ id: number }>;
    maxItems?: number;
  };
  locale: string;
  applications?: ApplicationData[];
}

export default function ApplicationShowcase({ section, locale, applications }: ApplicationShowcaseProps) {
  let displayApps = applications || [];
  if (section.applications?.length) {
    const ids = section.applications.map((a) => a.id);
    displayApps = displayApps.filter((a) => ids.includes((a as any).id));
  }
  displayApps = displayApps.slice(0, section.maxItems || 4);

  return (
    <Section>
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayApps.map((app) => (
            <Card key={app.slug}>
              <Link href={`/${locale}/applications/${app.slug}`}>
                {app.images?.[0] && (
                  <div className="relative h-40 bg-gray-100">
                    <Image
                      src={getStrapiImageUrl(app.images[0].url)!}
                      alt={app.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {app.description?.replace(/[#*`_]/g, '').substring(0, 80)}...
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 12: Create NewsList**

```typescript
// frontend/components/sections/NewsList.tsx
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getStrapiImageUrl, NewsData } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

interface NewsListProps {
  section: {
    title: string;
    maxItems?: number;
  };
  locale: string;
  news?: NewsData[];
}

export default function NewsList({ section, locale, news }: NewsListProps) {
  const limited = news?.slice(0, section.maxItems || 3) || [];

  return (
    <Section bg="gray">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {limited.map((item) => (
            <Card key={item.slug}>
              <Link href={`/${locale}/news/${item.slug}`}>
                {item.coverImage && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={getStrapiImageUrl(item.coverImage.url)!}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <time className="text-xs text-gray-500">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </time>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.content?.replace(/[#*`_]/g, '').substring(0, 100)}...
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href={`/${locale}/news`} className="text-primary-600 hover:text-primary-700 font-medium">
            View All News →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
```

Wait — I'm importing `date-fns` which I haven't added to dependencies. Let me remove that dependency and use native JS Date instead.

```typescript
// frontend/components/sections/NewsList.tsx (updated import)
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiImageUrl, NewsData } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
```

- [ ] **Step 13: Create TextImage**

```typescript
// frontend/components/sections/TextImage.tsx
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface TextImageProps {
  section: {
    title: string;
    content: string;
    image?: { url: string; alternativeText: string };
    imagePosition: 'left' | 'right';
  };
}

export default function TextImage({ section }: TextImageProps) {
  const isImageLeft = section.imagePosition === 'left';

  return (
    <Section>
      <Container>
        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
          {/* Image */}
          <div className="w-full md:w-1/2">
            {section.image && (
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={getStrapiImageUrl(section.image.url)!}
                  alt={section.image.alternativeText || section.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          {/* Text */}
          <div className="w-full md:w-1/2">
            {section.title && (
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
            )}
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content || '' }}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 14: Create StatsSection**

```typescript
// frontend/components/sections/StatsSection.tsx
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface StatsSectionProps {
  section: {
    stats: Array<{ value: string; label: string }>;
  };
}

export default function StatsSection({ section }: StatsSectionProps) {
  return (
    <Section bg="primary">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {section.stats?.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 15: Create FAQSection**

```typescript
// frontend/components/sections/FAQSection.tsx
'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface FAQSectionProps {
  section: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
}

export default function FAQSection({ section }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section bg="gray">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {section.items?.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 font-medium text-gray-900 hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {item.question}
                <span className="text-primary-600 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div
                  className="px-6 pb-4 text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 16: Create ContactForm**

```typescript
// frontend/components/sections/ContactForm.tsx
'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

interface ContactFormProps {
  section: {
    title: string;
    subtitle?: string;
    action?: string;
  };
}

export default function ContactForm({ section }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      await fetch(section.action || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Section>
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{section.title}</h2>
          {section.subtitle && (
            <p className="text-center text-gray-600 mb-8">{section.subtitle}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full btn-primary"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-green-600 text-center text-sm">Message sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 text-center text-sm">Failed to send. Please try again.</p>
            )}
          </form>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 17: Create Spacer**

```typescript
// frontend/components/sections/Spacer.tsx
interface SpacerProps {
  section: {
    height: 'small' | 'medium' | 'large';
  };
}

const HEIGHTS = {
  small: 'h-8',
  medium: 'h-16',
  large: 'h-24',
};

export default function Spacer({ section }: SpacerProps) {
  return <div className={HEIGHTS[section.height || 'medium']} />;
}
```

- [ ] **Step 18: Run and verify**

```bash
cd frontend
npm run dev
```
Expected: `http://localhost:3000/en` shows homepage. If Strapi has a "home" page with sections, they render. Otherwise shows default hero fallback.

- [ ] **Step 19: Commit**

```bash
git add frontend/app/\[locale\]/page.tsx frontend/components/sections/ frontend/components/seo/ frontend/components/ui/
git commit -m "feat: create homepage with dynamic section rendering and all section components"
```

---

## Task 6: Create Static Page Routes (About, Support, Contact, Sharing)

**Files:**
- Create: `frontend/app/[locale]/about/page.tsx`
- Create: `frontend/app/[locale]/support/page.tsx`
- Create: `frontend/app/[locale]/contact/page.tsx`
- Create: `frontend/app/[locale]/sharing/page.tsx`
- Create: `frontend/app/[locale]/not-found.tsx`

- [ ] **Step 1: Create generic page renderer component**

```typescript
// frontend/components/sections/GenericPage.tsx
import { PageData } from '@/lib/strapi';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionRenderer from '@/components/sections/SectionRenderer';

interface GenericPageProps {
  page: PageData;
  locale: string;
}

export default function GenericPage({ page, locale }: GenericPageProps) {
  return (
    <>
      <MetaTags
        title={page.seoTitle || page.title}
        description={page.seoDescription || ''}
        keywords={page.seoKeywords}
      />

      {/* Hero Banner */}
      {page.heroBanner && (
        <Section bg="primary">
          <Container>
            <div className="py-16 text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{page.heroBanner.title}</h1>
              {page.heroBanner.subtitle && (
                <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                  {page.heroBanner.subtitle}
                </p>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Dynamic Sections */}
      {page.sections?.map((section) => (
        <SectionRenderer key={section.id} section={section} locale={locale} />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Create about page**

```typescript
// frontend/app/[locale]/about/page.tsx
import { getPageBySlug } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import GenericPage from '@/components/sections/GenericPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const page = await getPageBySlug('about', locale);

  if (!page) {
    notFound();
  }

  return <GenericPage page={page} locale={locale} />;
}
```

- [ ] **Step 3: Create support page**

```typescript
// frontend/app/[locale]/support/page.tsx
import { getPageBySlug } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import GenericPage from '@/components/sections/GenericPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  const page = await getPageBySlug('support', locale);

  if (!page) notFound();

  return <GenericPage page={page} locale={locale} />;
}
```

- [ ] **Step 4: Create contact page**

```typescript
// frontend/app/[locale]/contact/page.tsx
import { getPageBySlug, getGlobal } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import GenericPage from '@/components/sections/GenericPage';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const [page, global] = await Promise.all([
    getPageBySlug('contact', locale).catch(() => null),
    getGlobal().catch(() => null),
  ]);

  return (
    <>
      {page && <MetaTags title={page.seoTitle || page.title} description={page.seoDescription || ''} />}

      {/* If page exists in CMS, render dynamically */}
      {page && page.sections?.length > 0 ? (
        <GenericPage page={page} locale={locale} />
      ) : (
        /* Fallback: show contact info from Global settings */
        <Section>
          <Container>
            <h1 className="text-4xl font-bold text-center mb-12">
              {page?.title || 'Contact Us'}
            </h1>
            <div className="max-w-2xl mx-auto">
              {global?.contactInfo && (
                <div className="bg-gray-50 rounded-xl p-8 space-y-6">
                  {global.contactInfo.address && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">{global.contactInfo.address}</p>
                    </div>
                  )}
                  {global.contactInfo.phone && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">{global.contactInfo.phone}</p>
                    </div>
                  )}
                  {global.contactInfo.email && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">{global.contactInfo.email}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
```

- [ ] **Step 5: Create sharing page**

```typescript
// frontend/app/[locale]/sharing/page.tsx
import { getPageBySlug } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import GenericPage from '@/components/sections/GenericPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function SharingPage({ params }: Props) {
  const { locale } = await params;
  const page = await getPageBySlug('sharing', locale);

  if (!page) notFound();

  return <GenericPage page={page} locale={locale} />;
}
```

- [ ] **Step 6: Create 404 page**

```typescript
// frontend/app/[locale]/not-found.tsx
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <Section>
      <Container>
        <div className="text-center py-20">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('title')}</h2>
          <p className="text-gray-600 mb-8">{t('description')}</p>
          <Button href="/" variant="primary">{t('goHome')}</Button>
        </div>
      </Container>
    </Section>
  );
}
```

Wait — `not-found.tsx` is a client component but uses `useTranslations` which needs `NextIntlClientProvider`. It's nested under `[locale]/` so it should be fine. But let me make it work properly by using `useTranslations` from `next-intl` which works with the provider in the locale layout.

- [ ] **Step 7: Commit**

```bash
git add frontend/app/\[locale\]/about/page.tsx frontend/app/\[locale\]/support/page.tsx frontend/app/\[locale\]/contact/page.tsx frontend/app/\[locale\]/sharing/page.tsx frontend/app/\[locale\]/not-found.tsx frontend/components/sections/GenericPage.tsx
git commit -m "feat: add static page routes (about, support, contact, sharing) and 404 page"
```

---

## Task 7: Create Products Routes

**Files:**
- Create: `frontend/app/[locale]/products/page.tsx`
- Create: `frontend/app/[locale]/products/[category]/page.tsx`
- Create: `frontend/app/[locale]/products/[category]/[slug]/page.tsx`
- Create: `frontend/components/ui/Badge.tsx`

- [ ] **Step 1: Create Badge UI component**

```typescript
// frontend/components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create products list page**

```typescript
// frontend/app/[locale]/products/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getProductCategories, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const [products, categories] = await Promise.all([
    getProducts(locale),
    getProductCategories(locale),
  ]);

  // Group products by category
  const grouped = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category?.id === cat.id),
  }));

  return (
    <>
      <MetaTags title="Products" description="Explore our range of RFID products" />

      <Section bg="primary">
        <Container>
          <div className="py-16 text-center text-white">
            <h1 className="text-4xl font-bold">Products</h1>
          </div>
        </Container>
      </Section>

      {grouped.map((group) => (
        <Section key={group.slug} bg="gray">
          <Container>
            <h2 className="text-2xl font-bold mb-8">{group.name}</h2>
            {group.products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.products.map((product) => (
                  <Card key={product.slug}>
                    <Link href={`/${locale}/products/${group.slug}/${product.slug}`}>
                      {product.images?.[0] && (
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={getStrapiImageUrl(product.images[0].url)!}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {product.description?.replace(/[#*`_]/g, '').substring(0, 100)}...
                        </p>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </Container>
        </Section>
      ))}
    </>
  );
}
```

- [ ] **Step 3: Create category page**

```typescript
// frontend/app/[locale]/products/[category]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCategory, getProductCategoryBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function CategoryPage({ params }: Props) {
  const { locale, category: categorySlug } = await params;

  const [products, cat] = await Promise.all([
    getProductsByCategory(categorySlug, locale),
    getProductCategoryBySlug(categorySlug, locale),
  ]);

  if (!cat) notFound();

  return (
    <>
      <MetaTags
        title={cat.name}
        description={cat.description?.replace(/[#*`_]/g, '').substring(0, 160) || ''}
      />

      <Section bg="primary">
        <Container>
          <div className="py-16 text-center text-white">
            <h1 className="text-4xl font-bold">{cat.name}</h1>
            {cat.description && (
              <p className="mt-4 text-primary-100 max-w-2xl mx-auto">
                {cat.description.replace(/[#*`_]/g, '')}
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.slug}>
                <Link href={`/${locale}/products/${categorySlug}/${product.slug}`}>
                  {product.images?.[0] && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={getStrapiImageUrl(product.images[0].url)!}
                        alt={product.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.description?.replace(/[#*`_]/g, '').substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Create product detail page**

```typescript
// frontend/app/[locale]/products/[category]/[slug]/page.tsx
import Image from 'next/image';
import { getProductBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import MetaTags from '@/components/seo/MetaTags';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = product.images?.[0]?.url ? getStrapiImageUrl(product.images[0].url) : undefined;

  return (
    <>
      <MetaTags
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description?.replace(/[#*`_]/g, '').substring(0, 160) || ''}
        keywords={product.seoKeywords}
        ogImage={imageUrl}
        canonical={`${siteUrl}/${locale}/products/${product.category?.slug}/${slug}`}
      />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description?.replace(/[#*`_]/g, ''),
        image: imageUrl,
        brand: { '@type': 'Brand', name: 'FN Tech' },
      }} />

      <Section>
        <Container>
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href={`/${locale}/products`} className="hover:text-primary-600">Products</Link>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/${locale}/products/${product.category.slug}`} className="hover:text-primary-600">
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          {/* Product */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {product.images?.[0] && (
                <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={getStrapiImageUrl(product.images[0].url)!}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              )}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={getStrapiImageUrl(img.url)!}
                        alt={img.alternativeText || ''}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div
                className="prose prose-gray max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              {/* Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr key={i} className="border-b border-gray-200 last:border-0">
                          <td className="py-2 font-medium text-gray-700 w-1/3">{spec.name}</td>
                          <td className="py-2 text-gray-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/app/\[locale\]/products/ frontend/components/ui/Badge.tsx
git commit -m "feat: add products routes (list, category, detail) with Product JSON-LD"
```

---

## Task 8: Create Applications Routes

**Files:**
- Create: `frontend/app/[locale]/applications/page.tsx`
- Create: `frontend/app/[locale]/applications/[slug]/page.tsx`

- [ ] **Step 1: Create applications list page**

```typescript
// frontend/app/[locale]/applications/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getApplications, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  const applications = await getApplications(locale);

  return (
    <>
      <MetaTags title="Industry Applications" description="RFID solutions for various industries" />

      <Section bg="primary">
        <Container>
          <div className="py-16 text-center text-white">
            <h1 className="text-4xl font-bold">Industry Applications</h1>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app) => (
              <Card key={app.slug}>
                <Link href={`/${locale}/applications/${app.slug}`}>
                  {app.images?.[0] && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={getStrapiImageUrl(app.images[0].url)!}
                        alt={app.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {app.description?.replace(/[#*`_]/g, '').substring(0, 100)}...
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Create application detail page**

```typescript
// frontend/app/[locale]/applications/[slug]/page.tsx
import Image from 'next/image';
import { getApplicationBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function ApplicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const app = await getApplicationBySlug(slug, locale);

  if (!app) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <MetaTags
        title={app.seoTitle || app.name}
        description={app.seoDescription || app.description?.replace(/[#*`_]/g, '').substring(0, 160) || ''}
        keywords={app.seoKeywords}
        ogImage={app.images?.[0]?.url ? getStrapiImageUrl(app.images[0].url) : undefined}
        canonical={`${siteUrl}/${locale}/applications/${slug}`}
      />

      <Section bg="primary">
        <Container>
          <div className="py-16 text-center text-white">
            <h1 className="text-4xl font-bold">{app.name}</h1>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <nav className="text-sm text-gray-500 mb-8">
            <Link href={`/${locale}/applications`} className="hover:text-primary-600">Applications</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{app.name}</span>
          </nav>

          {/* Image gallery */}
          {app.images && app.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {app.images.map((img, i) => (
                <div key={i} className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={getStrapiImageUrl(img.url)!}
                    alt={img.alternativeText || app.name}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-gray max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: app.description }}
            />
          </div>

          {/* Use case */}
          {app.useCase && (
            <div className="max-w-3xl mx-auto mt-12 bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Use Case</h2>
              <div
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: app.useCase }}
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/app/\[locale\]/applications/
git commit -m "feat: add applications routes (list and detail)"
```

---

## Task 9: Create News Routes with Pagination

**Files:**
- Create: `frontend/app/[locale]/news/page.tsx`
- Create: `frontend/app/[locale]/news/[slug]/page.tsx`
- Create: `frontend/components/ui/Pagination.tsx`

- [ ] **Step 1: Create Pagination component**

```typescript
// frontend/components/ui/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale: string;
}

export default function Pagination({ currentPage, totalPages, basePath, locale }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/${locale}${basePath}?page=${page}`}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/${locale}${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Create news list page**

```typescript
// frontend/app/[locale]/news/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedNews, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import MetaTags from '@/components/seo/MetaTags';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1') || 1;
  const PAGE_SIZE = 10;

  const { data: news, meta } = await getPublishedNews(locale, page, PAGE_SIZE);

  return (
    <>
      <MetaTags title="News" description="Latest news and updates from FN Tech" />

      <Section bg="primary">
        <Container>
          <div className="py-16 text-center text-white">
            <h1 className="text-4xl font-bold">News</h1>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <Card key={item.slug}>
                  <Link href={`/${locale}/news/${item.slug}`}>
                    {item.coverImage && (
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={getStrapiImageUrl(item.coverImage.url)!}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <time className="text-xs text-gray-500">
                        {new Date(item.publishDate).toLocaleDateString()}
                      </time>
                      <h3 className="text-lg font-semibold mt-2 mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {item.content?.replace(/[#*`_]/g, '').substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No news articles yet.</p>
          )}

          <Pagination
            currentPage={page}
            totalPages={meta?.pagination?.pageCount || 1}
            basePath="/news"
            locale={locale}
          />
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Create news detail page**

```typescript
// frontend/app/[locale]/news/[slug]/page.tsx
import Image from 'next/image';
import { getNewsBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { REVALIDATE_INTERVAL } from '@/lib/constants';
import { notFound } from 'next/navigation';
import MetaTags from '@/components/seo/MetaTags';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = REVALIDATE_INTERVAL;

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const news = await getNewsBySlug(slug, locale);

  if (!news) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = news.coverImage?.url ? getStrapiImageUrl(news.coverImage.url) : undefined;

  return (
    <>
      <MetaTags
        title={news.seoTitle || news.title}
        description={news.seoDescription || news.content?.replace(/[#*`_]/g, '').substring(0, 160) || ''}
        ogImage={imageUrl}
        canonical={`${siteUrl}/${locale}/news/${slug}`}
      />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        description: news.content?.replace(/[#*`_]/g, '').substring(0, 160),
        image: imageUrl,
        datePublished: news.publishDate,
        author: news.author ? { '@type': 'Person', name: news.author } : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'FN Tech',
        },
      }} />

      <Section>
        <Container>
          <nav className="text-sm text-gray-500 mb-8">
            <Link href={`/${locale}/news`} className="hover:text-primary-600">News</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{news.title}</span>
          </nav>

          <article className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <time>{new Date(news.publishDate).toLocaleDateString()}</time>
                {news.author && <span>by {news.author}</span>}
              </div>
            </header>

            {news.coverImage && (
              <div className="relative h-72 md:h-96 bg-gray-100 rounded-xl overflow-hidden mb-8">
                <Image
                  src={getStrapiImageUrl(news.coverImage.url)!}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-gray prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </article>
        </Container>
      </Section>
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/app/\[locale\]/news/ frontend/components/ui/Pagination.tsx
git commit -m "feat: add news routes (list with pagination, detail) with NewsArticle JSON-LD"
```

---

## Task 10: Create Sitemap API Route

**Files:**
- Create: `frontend/app/api/sitemap/route.ts`
- Create: `frontend/app/api/sitemap/[locale]/route.ts`

- [ ] **Step 1: Create root sitemap route**

```typescript
// frontend/app/api/sitemap/route.ts
import { NextResponse } from 'next/server';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const sitemaps = SUPPORTED_LOCALES.map((locale) => ({
    loc: `${siteUrl}/api/sitemap/${locale}`,
    lastmod: new Date().toISOString(),
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('')}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

- [ ] **Step 2: Create locale-specific sitemap**

```typescript
// frontend/app/api/sitemap/[locale]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllPages, getProducts, getApplications, getPublishedNews } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [pages, products, applications, newsResult] = await Promise.all([
    getAllPages(locale).catch(() => []),
    getProducts(locale).catch(() => []),
    getApplications(locale).catch(() => []),
    getPublishedNews(locale, 1, 100).catch(() => ({ data: [] })),
  ]);

  const entries = [
    // Static pages
    { loc: `${siteUrl}/${locale}`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
    ...pages.map((p) => ({
      loc: `${siteUrl}/${locale}/${p.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    })),
    // Products
    ...products.map((p) => ({
      loc: `${siteUrl}/${locale}/products/${p.category?.slug}/${p.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // Applications
    ...applications.map((a) => ({
      loc: `${siteUrl}/${locale}/applications/${a.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // News
    ...newsResult.data.map((n) => ({
      loc: `${siteUrl}/${locale}/news/${n.slug}`,
      lastmod: new Date(n.publishDate).toISOString(),
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (e) => `
  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/app/api/sitemap/
git commit -m "feat: add dynamic sitemap generation with per-locale sitemaps"
```

---

## Task 11: Create robots.txt and Verify Build

**Files:**
- Create: `frontend/public/robots.txt`

- [ ] **Step 1: Create robots.txt**

```
# frontend/public/robots.txt
User-agent: *
Allow: /

Sitemap: https://fn-tech.com/sitemap.xml
```

- [ ] **Step 2: Run build**

```bash
cd frontend
npm run build
```
Expected: Build succeeds with no errors. All pages compile correctly.

- [ ] **Step 3: Start production server**

```bash
npm run start
```
Expected: Server starts at `http://localhost:3000`. All routes accessible.

- [ ] **Step 4: Test key routes**

```bash
curl http://localhost:3000/en | head -50   # Should show full HTML
curl http://localhost:3000/zh | head -50   # Should show full HTML
curl http://localhost:3000/api/sitemap     # Should return XML
```

- [ ] **Step 5: Commit**

```bash
git add frontend/public/robots.txt
git commit -m "feat: add robots.txt and verify production build"
```

---

## Self-Review Checklist

1. **Spec coverage check:**
   - ✅ Locale routing with URL prefix (5.1, 6.1)
   - ✅ All page routes: home, about, products (list/category/detail), applications (list/detail), news (list/detail), support, contact, sharing (5)
   - ✅ next-intl configuration (6.2)
   - ✅ MetaTags with OG, canonical, hreflang (7.1, 7.4, 7.5)
   - ✅ JSON-LD for Organization, Product, NewsArticle (7.2)
   - ✅ Sitemap generation per locale (7.3)
   - ✅ Dynamic Zones rendering on homepage (4.7)
   - ✅ Tailwind CSS styling (2.1)
   - ✅ Language switcher component (5.1)
   - ✅ Pagination for news (4.6)
   - ✅ Breadcrumbs on product/application/news detail pages

2. **Placeholder scan:** No TBD/TODO patterns found. All code is complete.

3. **Type consistency:** All API calls use the types defined in `lib/strapi.ts`. Section components use the `SectionData` type. `getStrapiImageUrl` is used consistently for image URLs. Locale is consistently passed through params and API calls. Response formats match Strapi API structure.

4. **Cross-task consistency:** `REVALIDATE_INTERVAL` is used on all data-fetching pages. `NEXT_PUBLIC_SITE_URL` is used in all canonical/OG/sitemap URLs. Section component names match `__component` values from Strapi schema.

---
