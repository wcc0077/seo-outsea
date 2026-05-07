# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

FN Tech (上海孚恩电子科技有限公司) — industrial RFID hardware company website.

**Stack**: Strapi 5 (headless CMS) + Next.js 15 (App Router, i18n, Tailwind 3).

**Locales**: `en` (default), `zh`. Supported: `['en', 'zh']` in `frontend/lib/i18n.ts`.

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
│   ├── app/[locale]/         # Locale-scoped pages (products, applications, news, etc.)
│   ├── app/layout.tsx        # Root layout (fonts, global CSS)
│   ├── components/
│   │   ├── layout/           # Header, MegaMenu, Navbar, Footer, LanguageSwitcher
│   │   ├── sections/         # HeroSection, ProductGrid, ApplicationShowcase, etc.
│   │   └── ui/               # Button, Card, Badge, Pagination, Section
│   └── lib/
│       ├── strapi.ts         # API client, data interfaces, fetch helpers
│       └── i18n.ts           # Locale config, middleware config
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
- `/products/category/[slug]` — Products filtered by category
- `/products/[slug]` — Single product detail
- `/applications` — Application listing
- `/news` — News listing with pagination
- `/news/[slug]` — Single article
- `/support` — Support page
- `/sharing` — Knowledge base / FAQ
- `/contact` — Contact page
- `/about` — About page (intro)
- `/about/company` — Company facility photos
- `/about/history` — Development timeline
- `/about/honors` — Honors & certifications

**Layout**: `app/[locale]/layout.tsx` wraps all locale pages with:
- `NextIntlClientProvider` (i18n)
- `<Header>` (logo + MegaMenu + LanguageSwitcher)
- `<Footer>` (from Strapi global settings)

**MegaMenu** (`components/layout/MegaMenu.tsx`):
- Hover-activated dropdown panels for Products, Applications, Support, About
- Products: left sidebar (5 categories) + right 4-column image grid
- Applications: left sidebar + right 2-column layout (featured + 3 secondary cards)
- About: 4-column icon cards
- Uses 50ms debounce timer to prevent flicker when moving mouse between nav item and dropdown
- Fixed positioning at `HEADER_HEIGHT` (72px) below the header bar

**Strapi Client** (`lib/strapi.ts`):
- `fetchApi()` — wraps `fetch()` with `populate: '*'` by default, revalidation via ISR tags
- All data fetching functions return typed interfaces (`ProductData`, `ApplicationData`, etc.)
- `getStrapiImageUrl()` — resolves relative Strapi URLs to absolute

---

## Key Decisions & Patterns

1. **i18n via `next-intl`**: Locale is a catch-all route param (`[locale]`). Middleware in `lib/i18n.ts` handles locale detection and redirects.

2. **MegaMenu data is static**: `NAV_LINKS` in `app/[locale]/layout.tsx` is hardcoded per locale. Product/Application dropdown items are defined here, not fetched from Strapi. Strapi provides the *content* (product details, images) while navigation structure is static.

3. **Product/Application images fallback**: `PRODUCT_CATEGORIES` and `APPLICATION_CATEGORIES` in `MegaMenu.tsx` contain fallback image URLs. Strapi media is the source of truth when available; these fallbacks ensure the menu works before Strapi is seeded.

4. **Dynamic Zones for pages**: The `page` content type uses Strapi Dynamic Zones with 9 section components (`HeroSection`, `ProductGrid`, `StatsSection`, etc.), enabling CMS users to compose pages visually.

5. **DeepSeek translation utility**: `backend/src/utils/translate.ts` provides batch AI translation across all content types (product, product-category, application, application-category, rfid-tag, about-page, faq-article). Called via POST to `/{content-type}s/translate` endpoints.

6. **Import seed endpoints**: `/products/import` and `/faq-articles/import` create initial data from hardcoded arrays in controllers. Guarded by `existingCount > 0` check to prevent duplicate imports.

7. **No API token in frontend by default**: Frontend uses public endpoints (`auth: false` in Strapi routes). Token is optional in `NEXT_PUBLIC_STRAPI_API_TOKEN` for authenticated operations.
