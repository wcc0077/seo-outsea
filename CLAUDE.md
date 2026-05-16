# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

FN Tech (上海孚恩电子科技有限公司) — industrial RFID hardware company website.

**Stack**: Strapi 5 (headless CMS) + Next.js 15 (App Router, i18n, Tailwind 3).

**Locales**: `en` (default), `zh`, `fr`, `de`, `es`, `ru`. Supported: `['en', 'zh', 'fr', 'de', 'es', 'ru']` in `frontend/lib/i18n.ts`.

---

## Directory Structure

```
seo-outsea/
├── backend/                  # Strapi 5 CMS (runs on :1337)
│   ├── src/api/              # Content types: product, product-category, application, application-category, rfid-tag, news, page, faq-article, global, about-page
│   ├── src/components/       # Strapi components (sections/*, shared/*)
│   ├── config/               # server, database, middlewares, plugins, admin
│   └── src/utils/            # translate.ts (DeepSeek AI translation utility)
│
├── frontend/                 # Next.js 15 App Router (runs on :3000)
│   ├── app/
│   │   ├── layout.tsx        # Root layout (html + body, fonts, global CSS)
│   │   ├── [locale]/         # Locale-scoped pages
│   │   ├── sitemap.ts        # Sitemap index
│   │   ├── sitemap-*.ts      # Per-content-type sitemaps (products, applications, news, others)
│   │   ├── robots.ts         # Programmatic robots.txt generation
│   │   └── api/sitemap/      # API sitemap routes (index + per-locale)
│   ├── components/
│   │   ├── layout/           # Header, HeaderWrapper, MegaMenu, Navbar, Footer, LanguageSwitcher
│   │   ├── seo/              # MetaTags, JsonLd, StructuredData, GeoMeta
│   │   ├── sections/         # HeroSection, ProductGrid, ApplicationShowcase, NewsList, FAQSection, AnimatedHero, CertificateGallery, CompanyStats, ClientLogos, OfficesSection, GenericPage, SectionRenderer
│   │   └── ui/               # Button, Card, Badge, Pagination, Section, Container, Breadcrumb, ProductImageZoom, CertificateLightbox
│   ├── lib/
│   │   ├── strapi.ts         # API client with ISR revalidation, data interfaces, fetch helpers
│   │   ├── i18n.ts           # 6-locale config, middleware config
│   │   ├── seo-config.ts     # Central SEO config (site URL, sitemap intervals, robots rules, LLM bot allowlist)
│   │   ├── seo-utils.ts      # localeUrl(), buildAlternates() helpers
│   │   ├── nav-links.ts      # Dynamic nav link builder (Strapi fetch + fallback)
│   │   └── constants.ts      # SITE_NAME, PAGE_SIZE, REVALIDATE_INTERVAL, SECTION_COMPONENT_MAP
│   ├── messages/             # 6 locale JSON files (en, zh, fr, de, es, ru)
│   ├── public/
│   │   └── llm.txt           # Structured company/product data for AI/LLM crawlers
│   └── middleware.ts          # Locale detection and redirects
│
└── knowledge-base/           # Domain knowledge: product info, app cases, company info
```

---

## Development Commands

### Frontend (`frontend/`)

```bash
cd frontend

# Dev server with hot reload
npm run dev          # → http://localhost:3000

# Production build
npm run build        # TypeScript + Next.js build

# Serve production build
npm run start        # → http://localhost:3000

# Lint
npm run lint

# TypeScript check
npx tsc --noEmit
```

### Backend (`backend/`)

```bash
cd backend

# Dev server with admin panel + auto-reload
npm run develop      # → http://localhost:1337

# Production build (admin panel)
npm run build

# Start production
npm run start        # → http://localhost:1337
```

### Environment Variables

**Frontend** (`frontend/.env`):
- `NEXT_PUBLIC_STRAPI_URL` — Strapi base URL (default: `http://localhost:1337`)
- `NEXT_PUBLIC_STRAPI_API_TOKEN` — API token for authenticated requests

**Backend** (`backend/.env`):
- `APP_KEYS` — app encryption keys (required)
- `ADMIN_JWT_SECRET` — admin panel JWT secret (required)
- `API_TOKEN_SALT` — API token salt (required)
- `TRANSFER_TOKEN_SALT` — transfer token salt
- `JWT_SECRET` — users-permissions JWT secret
- `DEEPSEEK_API_KEY` — DeepSeek API key for translation feature

---

## Architecture

### Backend — Strapi 5

**Content Types** (all use i18n plugin, localized: true):

| Content Type | Schema File | Purpose |
|---|---|---|
| `product` | `backend/src/api/product/content-types/product/schema.json` | Individual products with specs, images, category relation |
| `product-category` | `backend/src/api/product-category/...` | Hierarchical categories (self-referential `parent`/`children` relations) |
| `application` | `backend/src/api/application/...` | Industry application/use case pages, linked to application-category |
| `application-category` | `backend/src/api/application-category/...` | Application categories (icon, slug, sortOrder, oneToMany to applications) |
| `rfid-tag` | `backend/src/api/rfid-tag/...` | RFID electronic tag products (tagType, frequency, specs, images) |
| `about-page` | `backend/src/api/about-page/...` | About section sub-pages (pageType: intro/gallery/history/honors) |
| `article` (news) | `backend/src/api/news/content-types/article/schema.json` | News articles with cover images, publish dates |
| `page` | `backend/src/api/page/...` | Dynamic pages via Dynamic Zones (sections/components) |
| `faq-article` | `backend/src/api/faq-article/...` | Knowledge base articles with categories and tags |
| `global` | `backend/src/api/global/...` | Single-type: site settings, logo, contact info, social links |

**Key patterns**:
- `strapi.db.query()` — low-level DB queries (used in custom controllers)
- `strapi.documents()` — Strapi 5 document API (auto-handles i18n, relations)
- All content types have `slug` (uid field) for URL routing
- Products link to categories via `manyToOne` relation on `category` field
- ProductCategory supports infinite depth via self-referential `parent`/`children` relations
- Applications link to application-categories via `manyToOne` relation on `category` field
- ApplicationCategory has `oneToMany` inverse relation to applications
- Custom endpoints in `routes/custom.ts` per API, all with `auth: false` for public reads

### Frontend — Next.js 15

**Routing** (`app/[locale]/`):
- `/` — Homepage (dynamic via Page content type or fallback)
- `/products` — Product listing
- `/products/[slug]` — Single product detail
- `/products/category/[slug]` — Products filtered by category
- `/rfid-tags` — RFID tags listing
- `/rfid-tags/[slug]` — RFID tag detail
- `/rfid-tags/category/[slug]` — RFID tags filtered by category
- `/applications` — Application listing
- `/applications/[slug]` — Single application detail
- `/applications/category/[slug]` — Applications filtered by category
- `/news` — News listing with pagination
- `/news/[slug]` — Single article
- `/support` — Support page
- `/sharing` — Knowledge base / FAQ listing
- `/sharing/[slug]` — FAQ article detail
- `/contact` — Contact page
- `/about` — About overview
- `/about/intro` — Company introduction
- `/about/company` — Company facility photos
- `/about/history` — Development timeline
- `/about/honors` — Honors & certifications

**Layout**: Two-layer layout without duplicate HTML tags:
- `app/layout.tsx` — Root layout renders `<html lang="en">` and `<body>` with Inter + Noto Sans font variables
- `app/[locale]/layout.tsx` — Locale layout wraps children with `NextIntlClientProvider`, `LocaleSetter`, `<HeaderWrapper>`, `<main>`, `<Footer>`, and renders Organization/WebSite JSON-LD structured data
- `LocaleSetter` (client component) sets `document.documentElement.lang` to the current locale, keeping `<html lang>` in sync without duplicating the HTML tag

**MegaMenu** (`components/layout/MegaMenu.tsx`):
- Hover-activated dropdown panels for Products, Applications, Support, About
- Products: left sidebar (5 categories) + right 4-column image grid
- Applications: left sidebar + right 2-column layout (featured + 3 secondary cards)
- About: 4-column icon cards
- Uses 50ms debounce timer to prevent flicker when moving mouse between nav item and dropdown
- Fixed positioning at `HEADER_HEIGHT` (72px) below the header bar

**Strapi Client** (`lib/strapi.ts`):
- `fetchApi()` — wraps `fetch()` with `populate: '*'` by default, ISR revalidation via `REVALIDATE_TIMES`
- `REVALIDATE_TIMES` — per-content-type revalidation intervals: products=1h, applications=1h, news=5min, about=24h, faq=1h, default=1h
- All data fetching functions return typed interfaces (`ProductData`, `ApplicationData`, etc.)
- `getStrapiImageUrl()` — resolves relative Strapi URLs to absolute

**SEO Infrastructure** (`lib/seo-config.ts` + `components/seo/`):
- `seo-config.ts` — central config: site URL, locale-region mapping, `SITEMAP_CONFIG`, `ROBOTS_TXT_CONFIG` (per-bot crawl delays, LLM bot allowlist: GPTBot, ClaudeBot, GoogleExtended, CCBot, Bytespider, AppleBot, Anthropic-AI)
- `seo-utils.ts` — `localeUrl()` builds locale-prefixed URLs, `buildAlternates()` builds hreflang alternate objects
- `MetaTags` — renders title, description, keywords, OG tags (with article-specific), Twitter cards, canonical, hreflang, Dublin Core, viewport, theme-color
- `StructuredData` — six JSON-LD types: Organization, WebSite, Breadcrumb, Product, Article, FAQ
- `GeoMeta` — geographic meta tags (geo.placename, geo.region, geo.position, ICBM)
- `robots.ts` — programmatic robots.txt with per-bot rules and LLM bot allowlist
- `sitemap.ts` + `sitemap-*.ts` — per-content-type sitemaps with hreflang alternates
- `llm.txt` — structured company/product data for AI/LLM crawlers

---

## Key Decisions & Patterns

1. **i18n via `next-intl`**: Locale is a catch-all route param (`[locale]`). Middleware in `middleware.ts` handles locale detection and redirects. 6 locales supported: en, zh, fr, de, es, ru.

2. **Hybrid navigation data**: `getNavLinks()` in `lib/nav-links.ts` dynamically fetches product/application categories from Strapi at build time, with hardcoded fallback items when Strapi is unavailable. Strapi provides the *content* and category structure; fallbacks ensure the menu works before Strapi is seeded.

3. **Centralized SEO config**: All SEO settings flow through `seo-config.ts` — site URL, locale-region mapping, sitemap intervals, robots rules, and LLM bot allowlist. Components consume this config rather than hardcoding values.

4. **ISR with per-content-type revalidation**: `REVALIDATE_TIMES` in `strapi.ts` defines different revalidation intervals per content type (news=5min for freshness, about=24h for stability). All fetch functions pass `{ next: { revalidate } }`.

5. **Dynamic Zones for pages**: The `page` content type uses Strapi Dynamic Zones with section components (`HeroSection`, `ProductGrid`, `StatsSection`, etc.), mapped to React components via `SECTION_COMPONENT_MAP` in `constants.ts`. `SectionRenderer` renders them dynamically.

6. **DeepSeek translation utility**: `backend/src/utils/translate.ts` provides batch AI translation across all content types (product, product-category, application, application-category, rfid-tag, about-page, faq-article). Called via POST to `/{content-type}s/translate` endpoints.

7. **Import seed endpoints**: `/products/import` and `/faq-articles/import` create initial data from hardcoded arrays in controllers. Guarded by `existingCount > 0` check to prevent duplicate imports.

8. **No API token in frontend by default**: Frontend uses public endpoints (`auth: false` in Strapi routes). Token is optional in `NEXT_PUBLIC_STRAPI_API_TOKEN` for authenticated operations.

9. **LLM/AI crawler strategy**: `robots.ts` explicitly allows major LLM bots (GPTBot, ClaudeBot, etc.) and `llm.txt` provides structured company/product data for AI consumption. This is a deliberate choice to maximize AI discoverability.

10. **No duplicate HTML tags**: Root layout (`app/layout.tsx`) is the only place `<html>` and `<body>` tags exist. Locale layout uses `LocaleSetter` client component to update `document.documentElement.lang` dynamically, avoiding hydration errors from nested HTML tags.
