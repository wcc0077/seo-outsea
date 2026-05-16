# CMS Architecture Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all hardcoded business content into Strapi CMS, unify page management under Page + Dynamic Zone, and fix multi-language issues.

**Architecture:** Bottom-up 4-layer approach. Layer 1 creates Strapi data types. Layer 2 makes frontend components query Strapi instead of using hardcoded arrays. Layer 3 migrates About/Support/Contact pages to use Page + Dynamic Zone. Layer 4 cleans up dead code and i18n JSON.

**Tech Stack:** Strapi 5 (headless CMS), Next.js 15 (App Router), next-intl (i18n), Tailwind 3, react-leaflet (maps)

---

## File Structure

### New files to create

```
backend/src/api/office/
  content-types/office/schema.json
  controllers/office.ts
  routes/office.ts
  routes/custom.ts
  services/office.ts

backend/src/api/client/
  content-types/client/schema.json
  controllers/client.ts
  routes/client.ts
  routes/custom.ts
  services/client.ts

backend/src/api/stat/
  content-types/stat/schema.json
  controllers/stat.ts
  routes/stat.ts
  routes/custom.ts
  services/stat.ts

backend/src/components/shared/certificate-item.json
backend/src/components/shared/product-node.json
backend/src/components/sections/offices-section.json
backend/src/components/sections/client-logos-section.json
backend/src/components/sections/certificate-gallery-section.json
```

### Files to modify

```
backend/src/api/page/content-types/page/schema.json          — add 3 new Dynamic Zone components
backend/src/components/sections/hero-section.json             — add products component field

frontend/lib/strapi.ts                                        — add 3 interfaces + 6 fetch functions + REVALIDATE_TIMES
frontend/lib/constants.ts                                     — add 3 entries to SECTION_COMPONENT_MAP
frontend/components/sections/SectionRenderer.tsx              — add 3 cases to switch
frontend/components/sections/CompanyStats.tsx                  — accept stats prop, remove hardcoded STATS
frontend/components/sections/ClientLogos.tsx                   — accept clients prop, remove hardcoded CLIENT_LOGOS
frontend/components/sections/OfficesSection.tsx                — accept offices/mapConfig props, remove hardcoded OFFICES
frontend/components/sections/AnimatedHero.tsx                  — accept nodes prop, remove hardcoded NODES
frontend/components/sections/CertificateGallery.tsx            — accept certificates prop
frontend/app/[locale]/about/intro/page.tsx                     — use GenericPage
frontend/app/[locale]/about/company/page.tsx                   — use GenericPage
frontend/app/[locale]/about/history/page.tsx                   — use GenericPage
frontend/app/[locale]/about/honors/page.tsx                    — use GenericPage
frontend/app/[locale]/support/page.tsx                         — use GenericPage
frontend/app/[locale]/contact/page.tsx                         — use GenericPage + Global.contactInfo
frontend/messages/en.json                                      — strip business content
frontend/messages/zh.json                                      — strip business content
frontend/messages/fr.json                                      — strip business content
frontend/messages/de.json                                      — strip business content
frontend/messages/es.json                                      — strip business content
frontend/messages/ru.json                                      — strip business content
```

### Files to delete (Layer 4)

```
backend/src/api/about-page/   (entire directory)
frontend/lib/strapi.ts        (getAboutPageBySlug, AboutPageData)
```

---

## Layer 1 — Data Foundation

### Task 1: Create Office content type

**Files:**
- Create: `backend/src/api/office/content-types/office/schema.json`
- Create: `backend/src/api/office/controllers/office.ts`
- Create: `backend/src/api/office/routes/office.ts`
- Create: `backend/src/api/office/routes/custom.ts`
- Create: `backend/src/api/office/services/office.ts`

- [ ] **Step 1: Create schema.json**

```json
{
  "kind": "collectionType",
  "collectionName": "offices",
  "info": {
    "singularName": "office",
    "pluralName": "offices",
    "displayName": "Office",
    "description": "Company office locations"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "address": { "type": "text" },
    "phone": { "type": "string" },
    "phone2": { "type": "string" },
    "fax": { "type": "string" },
    "email": { "type": "email" },
    "website": { "type": "string" },
    "zipCode": { "type": "string" },
    "lat": { "type": "float" },
    "lng": { "type": "float" },
    "isHQ": { "type": "boolean", "default": false },
    "sortOrder": { "type": "integer", "default": 0 }
  }
}
```

- [ ] **Step 2: Create controller**

```typescript
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::office.office', ({ strapi }) => ({
  async find(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::office.office').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
    });
    return { data: entities, meta: {} };
  },

  async published(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::office.office').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
    });
    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::office.office').count({});
    if (existingCount > 0) {
      return ctx.badRequest('Offices already exist. Delete existing data first.');
    }
    const locale = ctx.request.body?.locale || 'zh';
    const offices = ctx.request.body?.data || [];
    const created = [];
    for (const office of offices) {
      const entity = await strapi.documents('api::office.office').create({
        data: { ...office, locale },
        status: 'published',
      });
      created.push(entity);
    }
    return { data: created, meta: {} };
  },

  async translate(ctx) {
    const { translate: translateUtil } = await import('../../../utils/translate');
    return translateUtil(ctx, 'api::office.office', ['name', 'address']);
  },
}));
```

- [ ] **Step 3: Create core route**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::office.office');
```

- [ ] **Step 4: Create custom routes**

```typescript
export default {
  routes: [
    { method: 'GET', path: '/offices', handler: 'office.find', config: { auth: false } },
    { method: 'GET', path: '/offices/published', handler: 'office.published', config: { auth: false } },
    { method: 'POST', path: '/offices/import', handler: 'office.import', config: { auth: false } },
    { method: 'POST', path: '/offices/translate', handler: 'office.translate', config: { auth: false } },
  ],
};
```

- [ ] **Step 5: Create service**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::office.office');
```

- [ ] **Step 6: Verify Strapi starts**

Run: `cd backend && npm run develop`
Expected: Strapi admin shows "Office" in Content-Type Builder with all fields

- [ ] **Step 7: Commit**

```bash
git add backend/src/api/office/
git commit -m "feat: add Office content type to Strapi"
```

---

### Task 2: Create Client content type

**Files:**
- Create: `backend/src/api/client/content-types/client/schema.json`
- Create: `backend/src/api/client/controllers/client.ts`
- Create: `backend/src/api/client/routes/client.ts`
- Create: `backend/src/api/client/routes/custom.ts`
- Create: `backend/src/api/client/services/client.ts`

- [ ] **Step 1: Create schema.json**

```json
{
  "kind": "collectionType",
  "collectionName": "clients",
  "info": {
    "singularName": "client",
    "pluralName": "clients",
    "displayName": "Client",
    "description": "Client/partner company logos"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "logo": { "type": "media", "multiple": false, "required": true, "allowedTypes": ["images"] },
    "sortOrder": { "type": "integer", "default": 0 }
  }
}
```

- [ ] **Step 2: Create controller**

```typescript
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::client.client', ({ strapi }) => ({
  async find(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::client.client').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
      populate: { logo: true },
    });
    return { data: entities, meta: {} };
  },

  async published(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::client.client').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
      populate: { logo: true },
    });
    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::client.client').count({});
    if (existingCount > 0) {
      return ctx.badRequest('Clients already exist. Delete existing data first.');
    }
    const locale = ctx.request.body?.locale || 'zh';
    const clients = ctx.request.body?.data || [];
    const created = [];
    for (const client of clients) {
      const entity = await strapi.documents('api::client.client').create({
        data: { ...client, locale },
        status: 'published',
      });
      created.push(entity);
    }
    return { data: created, meta: {} };
  },

  async translate(ctx) {
    const { translate: translateUtil } = await import('../../../utils/translate');
    return translateUtil(ctx, 'api::client.client', ['name']);
  },
}));
```

- [ ] **Step 3: Create core route**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::client.client');
```

- [ ] **Step 4: Create custom routes**

```typescript
export default {
  routes: [
    { method: 'GET', path: '/clients', handler: 'client.find', config: { auth: false } },
    { method: 'GET', path: '/clients/published', handler: 'client.published', config: { auth: false } },
    { method: 'POST', path: '/clients/import', handler: 'client.import', config: { auth: false } },
    { method: 'POST', path: '/clients/translate', handler: 'client.translate', config: { auth: false } },
  ],
};
```

- [ ] **Step 5: Create service**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::client.client');
```

- [ ] **Step 6: Verify Strapi starts**

Run: `cd backend && npm run develop`
Expected: Strapi admin shows "Client" in Content-Type Builder

- [ ] **Step 7: Commit**

```bash
git add backend/src/api/client/
git commit -m "feat: add Client content type to Strapi"
```

---

### Task 3: Create Stat content type

**Files:**
- Create: `backend/src/api/stat/content-types/stat/schema.json`
- Create: `backend/src/api/stat/controllers/stat.ts`
- Create: `backend/src/api/stat/routes/stat.ts`
- Create: `backend/src/api/stat/routes/custom.ts`
- Create: `backend/src/api/stat/services/stat.ts`

- [ ] **Step 1: Create schema.json**

```json
{
  "kind": "collectionType",
  "collectionName": "stats",
  "info": {
    "singularName": "stat",
    "pluralName": "stats",
    "displayName": "Stat",
    "description": "Company statistics displayed in stats sections"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "value": { "type": "string", "required": true },
    "label": { "type": "string", "required": true },
    "sortOrder": { "type": "integer", "default": 0 }
  }
}
```

- [ ] **Step 2: Create controller**

```typescript
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::stat.stat', ({ strapi }) => ({
  async find(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::stat.stat').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
    });
    return { data: entities, meta: {} };
  },

  async published(ctx) {
    const locale = ctx.query.locale || 'en';
    const entities = await strapi.db.query('api::stat.stat').findMany({
      where: { locale, publishedAt: { $notNull: true } },
      orderBy: { sortOrder: 'asc' },
    });
    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCount = await strapi.db.query('api::stat.stat').count({});
    if (existingCount > 0) {
      return ctx.badRequest('Stats already exist. Delete existing data first.');
    }
    const locale = ctx.request.body?.locale || 'zh';
    const stats = ctx.request.body?.data || [];
    const created = [];
    for (const stat of stats) {
      const entity = await strapi.documents('api::stat.stat').create({
        data: { ...stat, locale },
        status: 'published',
      });
      created.push(entity);
    }
    return { data: created, meta: {} };
  },

  async translate(ctx) {
    const { translate: translateUtil } = await import('../../../utils/translate');
    return translateUtil(ctx, 'api::stat.stat', ['value', 'label']);
  },
}));
```

- [ ] **Step 3: Create core route**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreRouter('api::stat.stat');
```

- [ ] **Step 4: Create custom routes**

```typescript
export default {
  routes: [
    { method: 'GET', path: '/stats', handler: 'stat.find', config: { auth: false } },
    { method: 'GET', path: '/stats/published', handler: 'stat.published', config: { auth: false } },
    { method: 'POST', path: '/stats/import', handler: 'stat.import', config: { auth: false } },
    { method: 'POST', path: '/stats/translate', handler: 'stat.translate', config: { auth: false } },
  ],
};
```

- [ ] **Step 5: Create service**

```typescript
import { factories } from '@strapi/strapi';
export default factories.createCoreService('api::stat.stat');
```

- [ ] **Step 6: Verify Strapi starts**

Run: `cd backend && npm run develop`
Expected: Strapi admin shows "Stat" in Content-Type Builder

- [ ] **Step 7: Commit**

```bash
git add backend/src/api/stat/
git commit -m "feat: add Stat content type to Strapi"
```

---

### Task 4: Create new Strapi section components

**Files:**
- Create: `backend/src/components/shared/certificate-item.json`
- Create: `backend/src/components/shared/product-node.json`
- Create: `backend/src/components/sections/offices-section.json`
- Create: `backend/src/components/sections/client-logos-section.json`
- Create: `backend/src/components/sections/certificate-gallery-section.json`

- [ ] **Step 1: Create shared/certificate-item.json**

```json
{
  "collectionName": "components_shared_certificate_items",
  "info": {
    "displayName": "Certificate Item",
    "icon": "picture",
    "description": "Certificate or honor image with title and category"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "image": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "category": { "type": "enumeration", "enum": ["qualification", "certification", "ip"] }
  }
}
```

- [ ] **Step 2: Create shared/product-node.json**

```json
{
  "collectionName": "components_shared_product_nodes",
  "info": {
    "displayName": "Product Node",
    "icon": "grid",
    "description": "Product thumbnail for AnimatedHero network visualization"
  },
  "options": {},
  "attributes": {
    "label": { "type": "string", "required": true },
    "image": { "type": "media", "multiple": false, "required": true, "allowedTypes": ["images"] }
  }
}
```

- [ ] **Step 3: Create sections/offices-section.json**

```json
{
  "collectionName": "components_sections_offices_sections",
  "info": {
    "displayName": "Offices Section",
    "icon": "map",
    "description": "Office locations with interactive map"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string" },
    "mapCenterLat": { "type": "float", "default": 33 },
    "mapCenterLng": { "type": "float", "default": 108 },
    "mapZoom": { "type": "integer", "default": 5 }
  }
}
```

- [ ] **Step 4: Create sections/client-logos-section.json**

```json
{
  "collectionName": "components_sections_client_logos_sections",
  "info": {
    "displayName": "Client Logos Section",
    "icon": "star",
    "description": "Infinite scroll marquee of client logos"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string" }
  }
}
```

- [ ] **Step 5: Create sections/certificate-gallery-section.json**

```json
{
  "collectionName": "components_sections_certificate_gallery_sections",
  "info": {
    "displayName": "Certificate Gallery Section",
    "icon": "picture",
    "description": "Masonry gallery of certificates with lightbox"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string" },
    "certificates": { "type": "component", "repeatable": true, "component": "shared.certificate-item" }
  }
}
```

- [ ] **Step 6: Verify Strapi starts with new components**

Run: `cd backend && npm run develop`
Expected: Strapi admin shows all 5 new components in Content-Type Builder

- [ ] **Step 7: Commit**

```bash
git add backend/src/components/shared/certificate-item.json backend/src/components/shared/product-node.json backend/src/components/sections/offices-section.json backend/src/components/sections/client-logos-section.json backend/src/components/sections/certificate-gallery-section.json
git commit -m "feat: add offices, client-logos, certificate-gallery section components"
```

---

### Task 5: Update Page Dynamic Zone and HeroSection

**Files:**
- Modify: `backend/src/api/page/content-types/page/schema.json`
- Modify: `backend/src/components/sections/hero-section.json`

- [ ] **Step 1: Add 3 new components to Page's Dynamic Zone**

In `backend/src/api/page/content-types/page/schema.json`, update the `sections` attribute's `components` array to append:

```json
"sections": {
  "type": "dynamiczone",
  "components": [
    "sections.hero-section",
    "sections.product-grid",
    "sections.application-showcase",
    "sections.news-list",
    "sections.text-image",
    "sections.stats-section",
    "sections.faq-section",
    "sections.contact-form",
    "sections.spacer",
    "sections.offices-section",
    "sections.client-logos-section",
    "sections.certificate-gallery-section"
  ]
}
```

- [ ] **Step 2: Add products field to HeroSection**

In `backend/src/components/sections/hero-section.json`, add a `products` attribute:

```json
{
  "collectionName": "components_sections_hero_sections",
  "info": {
    "displayName": "Hero Section",
    "icon": "bold"
  },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true },
    "subtitle": { "type": "text" },
    "backgroundImage": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "ctaLabel": { "type": "string" },
    "ctaUrl": { "type": "string" },
    "products": { "type": "component", "repeatable": true, "component": "shared.product-node" }
  }
}
```

- [ ] **Step 3: Verify Strapi starts**

Run: `cd backend && npm run develop`
Expected: Page content type now shows 12 section options in Dynamic Zone; HeroSection shows products field

- [ ] **Step 4: Commit**

```bash
git add backend/src/api/page/content-types/page/schema.json backend/src/components/sections/hero-section.json
git commit -m "feat: add offices/client-logos/certificate-gallery to Page Dynamic Zone, add products to HeroSection"
```

---

### Task 6: Migrate old-domain images to Strapi Media

**Files:**
- No code changes — manual operation + data update

- [ ] **Step 1: Download all old-domain images**

Create a script `scripts/migrate-images.ts` that:
1. Reads all image URLs from `scripts/scraped-data/products.json`, `scripts/scraped-data/rfid-tags.json`
2. Downloads each unique image from `pmtdb1c40-pic17.websiteonline.cn`
3. Saves to `scripts/migrated-images/` with a deterministic filename based on URL hash

Run: `npx tsx scripts/migrate-images.ts`
Expected: 30+ images downloaded to `scripts/migrated-images/`

- [ ] **Step 2: Upload images to Strapi Media library**

Use the Strapi Upload API to upload each image:

```bash
for file in scripts/migrated-images/*; do
  curl -X POST http://localhost:1337/api/upload \
    -H "Authorization: Bearer $STRAPI_TOKEN" \
    -F "files=@$file"
done
```

Expected: All images available in Strapi Media library

- [ ] **Step 3: Update product/tag import endpoints to use uploaded media IDs**

In the product and rfid-tag import controllers, after creating each entity, update its `images` field to reference the uploaded Strapi media files instead of external URLs. The `imageUrl` string fields can remain as fallbacks.

- [ ] **Step 4: Verify images render in frontend**

Run: `cd frontend && npm run dev`
Navigate to product pages and verify images load from Strapi Media URLs (not old domain)

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-images.ts
git commit -m "feat: add image migration script for old-domain URLs"
```

---

## Layer 2 — Frontend Data Layer

### Task 7: Add new interfaces and fetch functions to strapi.ts

**Files:**
- Modify: `frontend/lib/strapi.ts`

- [ ] **Step 1: Add REVALIDATE_TIMES entries**

Find the `REVALIDATE_TIMES` constant and add:

```typescript
export const REVALIDATE_TIMES = {
  products: 3600,
  applications: 3600,
  news: 300,
  about: 86400,
  faq: 3600,
  offices: 86400,    // offices rarely change
  clients: 86400,    // clients rarely change
  stats: 86400,      // stats rarely change
  default: 3600,
} as const;
```

- [ ] **Step 2: Add new interfaces**

After the existing interfaces, add:

```typescript
export interface OfficeData {
  documentId?: string;
  name: string;
  address: string;
  phone: string;
  phone2?: string;
  fax?: string;
  email?: string;
  website?: string;
  zipCode?: string;
  lat: number;
  lng: number;
  isHQ: boolean;
  sortOrder: number;
}

export interface ClientData {
  documentId?: string;
  name: string;
  logo: { url: string };
  sortOrder: number;
}

export interface StatData {
  documentId?: string;
  value: string;
  label: string;
  sortOrder: number;
}
```

- [ ] **Step 3: Add fetch functions**

After the existing fetch functions, add:

```typescript
export async function getOffices(locale: string): Promise<OfficeData[]> {
  try {
    const data = await fetchApi<OfficeData[]>(
      '/offices/published',
      { locale },
      { next: { revalidate: REVALIDATE_TIMES.offices } }
    );
    const seen = new Set<string>();
    return (data || []).filter((item) => {
      const key = item.documentId || item.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

export async function getClients(locale: string): Promise<ClientData[]> {
  try {
    const data = await fetchApi<ClientData[]>(
      '/clients/published',
      { locale },
      { next: { revalidate: REVALIDATE_TIMES.clients } }
    );
    const seen = new Set<string>();
    return (data || []).filter((item) => {
      const key = item.documentId || item.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

export async function getStats(locale: string): Promise<StatData[]> {
  try {
    const data = await fetchApi<StatData[]>(
      '/stats/published',
      { locale },
      { next: { revalidate: REVALIDATE_TIMES.stats } }
    );
    const seen = new Set<string>();
    return (data || []).filter((item) => {
      const key = item.documentId || item.value;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/strapi.ts
git commit -m "feat: add Office, Client, Stat interfaces and fetch functions"
```

---

### Task 8: Update CompanyStats component

**Files:**
- Modify: `frontend/components/sections/CompanyStats.tsx`

- [ ] **Step 1: Update component to accept stats prop**

Replace the entire file content:

```typescript
import { StatData } from '@/lib/strapi';

interface CompanyStatsProps {
  title?: string;
  subtitle?: string;
  stats?: StatData[];
}

export default function CompanyStats({ title, subtitle, stats }: CompanyStatsProps) {
  const displayStats = stats || [];

  if (displayStats.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2b5e 0%, #1a4a8a 50%, #0f2b5e 100%)' }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="flex items-center gap-4 mb-20">
            <div className="flex items-center -space-x-3">
              <div className="w-16 h-14 -skew-x-12 rounded" style={{ background: '#1a3d7a', boxShadow: 'inset 0 0 20px rgba(0,0,0,.3)' }} />
              <div className="w-6 h-14 -skew-x-12 rounded" style={{ background: '#f0a500', boxShadow: '0 0 20px rgba(240,165,0,.3)' }} />
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">{title}</h2>
              {subtitle && (
                <span className="text-sm font-light text-blue-200/60 tracking-widest uppercase hidden sm:inline">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayStats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 30px rgba(240,165,0,.15)' }} />
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105"
                  style={{
                    border: '3px solid #f0a500',
                    background: 'rgba(240,165,0,.05)',
                  }}
                />
                <span className="relative text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              <p className="text-center text-blue-100/70 text-sm font-medium tracking-wide max-w-[160px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add frontend/components/sections/CompanyStats.tsx
git commit -m "refactor: CompanyStats accepts stats prop from Strapi instead of hardcoded array"
```

---

### Task 9: Update ClientLogos component

**Files:**
- Modify: `frontend/components/sections/ClientLogos.tsx`

- [ ] **Step 1: Update component to accept clients prop**

Replace the entire file content:

```typescript
import Image from 'next/image';
import { ClientData } from '@/lib/strapi';

interface ClientLogosProps {
  title?: string;
  clients?: ClientData[];
}

export default function ClientLogos({ title, clients = [] }: ClientLogosProps) {
  if (clients.length === 0) return null;

  // Duplicate set for seamless infinite scroll
  const scrollLogos = [...clients, ...clients];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-8 animate-marquee"
            style={{ width: 'max-content' }}
          >
            {scrollLogos.map((client, index) => (
              <div
                key={`${client.documentId || client.name}-${index}`}
                className="flex-shrink-0 w-[142px] h-[80px] flex items-center justify-center rounded-lg bg-white border border-neutral-200 hover:border-primary-300 transition-colors duration-200"
              >
                <Image
                  src={client.logo.url}
                  alt={client.name}
                  className="max-w-[120px] max-h-[60px] object-contain"
                  width={120}
                  height={60}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add frontend/components/sections/ClientLogos.tsx
git commit -m "refactor: ClientLogos accepts clients prop from Strapi instead of hardcoded array"
```

---

### Task 10: Update OfficesSection component

**Files:**
- Modify: `frontend/components/sections/OfficesSection.tsx`

- [ ] **Step 1: Update component to accept offices and mapConfig props**

Replace the `OFFICES` constant and `OfficeLocation` interface with props. The component receives `offices: OfficeData[]` and `mapConfig: { centerLat: number; centerLng: number; zoom: number }` as props. Remove the hardcoded `OFFICES` array entirely. Update the `HQCard` and `OfficeCard` subcomponents to use `OfficeData` fields directly (no more `isZh ? office.name : office.nameEn` — the name is already localized by Strapi i18n).

Key changes:
- Remove `OfficeLocation` interface and `OFFICES` constant
- Accept `offices: OfficeData[]` and `mapConfig` props
- Replace `isZh ? office.name : office.nameEn` with `office.name`
- Replace `isZh ? office.address : office.addressEn` with `office.address`
- Use `mapConfig.centerLat`, `mapConfig.centerLng`, `mapConfig.zoom` for map initialization

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add frontend/components/sections/OfficesSection.tsx
git commit -m "refactor: OfficesSection accepts offices/mapConfig props from Strapi instead of hardcoded array"
```

---

### Task 11: Update AnimatedHero component

**Files:**
- Modify: `frontend/components/sections/AnimatedHero.tsx`

- [ ] **Step 1: Update component to accept nodes prop**

Add a `nodes` prop of type `Array<{ label: string; image: string }>` to `AnimatedHeroProps`. Remove the hardcoded `NODES` constant and `NetworkNode` type. When `nodes` is provided, use it; when not, render the hero without the network visualization (just the text portion).

Key changes:
- Remove `NetworkNode` type and `NODES` constant
- Add `nodes?: Array<{ label: string; image: string }>` to `AnimatedHeroProps`
- In the SVG section, iterate over `nodes` prop instead of `NODES`
- If `nodes` is empty/undefined, render text-only layout (no SVG)

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add frontend/components/sections/AnimatedHero.tsx
git commit -m "refactor: AnimatedHero accepts nodes prop from Strapi instead of hardcoded array"
```

---

### Task 12: Update SectionRenderer for new section types

**Files:**
- Modify: `frontend/components/sections/SectionRenderer.tsx`
- Modify: `frontend/lib/constants.ts`

- [ ] **Step 1: Add new entries to SECTION_COMPONENT_MAP**

In `frontend/lib/constants.ts`, add:

```typescript
'sections.offices-section': 'OfficesSection',
'sections.client-logos-section': 'ClientLogos',
'sections.certificate-gallery-section': 'CertificateGallery',
```

- [ ] **Step 2: Add new cases to SectionRenderer switch**

In `frontend/components/sections/SectionRenderer.tsx`, add imports and cases:

```typescript
import OfficesSection from './OfficesSection';
import ClientLogos from './ClientLogos';
import CertificateGallery from './CertificateGallery';
```

Add cases in the switch:

```typescript
case 'sections.offices-section': {
  const { title, mapCenterLat, mapCenterLng, mapZoom } = section as {
    title?: string;
    mapCenterLat?: number;
    mapCenterLng?: number;
    mapZoom?: number;
  };
  return (
    <OfficesSection
      locale={locale}
      title={title}
      mapConfig={{
        centerLat: mapCenterLat ?? 33,
        centerLng: mapCenterLng ?? 108,
        zoom: mapZoom ?? 5,
      }}
    />
  );
}

case 'sections.client-logos-section': {
  const { title } = section as { title?: string };
  return <ClientLogos title={title} locale={locale} />;
}

case 'sections.certificate-gallery-section': {
  const { title, certificates } = section as {
    title?: string;
    certificates?: Array<{
      title: string;
      image?: { url: string };
      category?: string;
    }>;
  };
  return <CertificateGallery title={title} certificates={certificates || []} locale={locale} />;
}
```

Note: `OfficesSection` and `ClientLogos` will fetch their data from Strapi internally (they are client components that need to call the API). Alternatively, they can accept pre-fetched data as props from the server-side `SectionRenderer`. The approach depends on whether they remain client components — if so, they'll need to fetch data themselves or receive it via props. Since `SectionRenderer` is a server component, the cleanest approach is to fetch data in the page and pass it through.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd frontend && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add frontend/components/sections/SectionRenderer.tsx frontend/lib/constants.ts
git commit -m "feat: add offices/client-logos/certificate-gallery cases to SectionRenderer"
```

---

### Task 13: Update Contact page to use Global.contactInfo

**Files:**
- Modify: `frontend/app/[locale]/contact/page.tsx`

- [ ] **Step 1: Replace hardcoded phone/email with Global.contactInfo**

Find the hardcoded `tel:4000-56-5516` and `mailto:sales@fn-tech.com` in the contact page. Replace with data from the `Global` type that's already fetched in the layout. The page needs to receive `globalData` as a prop or fetch it directly via `getGlobal()`.

Key changes:
- Import `getGlobal` from `@/lib/strapi`
- Call `const globalData = await getGlobal().catch(() => null)` in the page component
- Replace `4000-56-5516` with `globalData?.contactInfo?.phone || '4000-56-5516'`
- Replace `sales@fn-tech.com` with `globalData?.contactInfo?.email || 'sales@fn-tech.com'`

- [ ] **Step 2: Verify the page renders correctly**

Run: `cd frontend && npm run dev`
Navigate to `/en/contact` and verify contact info displays

- [ ] **Step 3: Commit**

```bash
git add frontend/app/[locale]/contact/page.tsx
git commit -m "fix: Contact page uses Global.contactInfo instead of hardcoded phone/email"
```

---

## Layer 3 — Page Migration

### Task 14: Migrate About Intro page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/about/intro/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

Replace the entire page file with:

```typescript
import { getPageBySlug } from '@/lib/strapi';
import GenericPage from '@/components/sections/GenericPage';

export default async function AboutIntroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="about-intro" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Use the Strapi admin or a POST to `/api/pages/import` to create a Page with slug `about-intro` containing these Dynamic Zone sections:
- HeroSection (title: "About FN Tech" / "关于孚恩")
- StatsSection (with stat items from current hardcoded values)
- TextImage (company overview content)
- TextImage (core capabilities content)
- TextImage (R&D strength content)

- [ ] **Step 3: Verify the page renders correctly**

Run: `cd frontend && npm run dev`
Navigate to `/en/about/intro` and `/zh/about/intro`
Expected: Page renders from Strapi Dynamic Zone data

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/about/intro/page.tsx
git commit -m "refactor: About Intro page uses GenericPage with Dynamic Zone"
```

---

### Task 15: Migrate About Company page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/about/company/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

```typescript
import GenericPage from '@/components/sections/GenericPage';

export default async function AboutCompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="about-company" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Create a Page with slug `about-company` containing:
- HeroSection
- TextImage sections for each facility (6 total, with images from Strapi Media)
- StatsSection

- [ ] **Step 3: Verify the page renders correctly**

Navigate to `/en/about/company` and `/zh/about/company`

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/about/company/page.tsx
git commit -m "refactor: About Company page uses GenericPage with Dynamic Zone"
```

---

### Task 16: Migrate About History page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/about/history/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

```typescript
import GenericPage from '@/components/sections/GenericPage';

export default async function AboutHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="about-history" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Create a Page with slug `about-history` containing:
- HeroSection
- TextImage sections for each timeline event (10 total, year as title, description as content)

- [ ] **Step 3: Verify the page renders correctly**

Navigate to `/en/about/history` and `/zh/about/history`

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/about/history/page.tsx
git commit -m "refactor: About History page uses GenericPage with Dynamic Zone"
```

---

### Task 17: Migrate About Honors page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/about/honors/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

```typescript
import GenericPage from '@/components/sections/GenericPage';

export default async function AboutHonorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="about-honors" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Create a Page with slug `about-honors` containing:
- HeroSection
- CertificateGallerySection (with all 13 certificate items + 8 honor items)

- [ ] **Step 3: Verify the page renders correctly**

Navigate to `/en/about/honors` and `/zh/about/honors`

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/about/honors/page.tsx
git commit -m "refactor: About Honors page uses GenericPage with CertificateGallerySection"
```

---

### Task 18: Migrate Support page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/support/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

```typescript
import GenericPage from '@/components/sections/GenericPage';

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="support" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Create a Page with slug `support` containing:
- HeroSection (title: "Technical Support" / "技术支持")
- TextImage sections for 4 support cards (product support, service support, FAQ, knowledge sharing)
- TextImage section for contact info (using Global.contactInfo)
- FAQSection (with FAQ items)

- [ ] **Step 3: Verify the page renders correctly**

Navigate to `/en/support` and `/zh/support`
Expected: All content renders from Strapi, no hardcoded Chinese

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/support/page.tsx
git commit -m "refactor: Support page uses GenericPage with Dynamic Zone — eliminates all hardcoded Chinese"
```

---

### Task 19: Migrate Contact page to GenericPage

**Files:**
- Modify: `frontend/app/[locale]/contact/page.tsx`

- [ ] **Step 1: Replace page implementation with GenericPage**

```typescript
import GenericPage from '@/components/sections/GenericPage';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <GenericPage params={Promise.resolve({ locale })} slug="contact" />;
}
```

- [ ] **Step 2: Seed the Page content in Strapi**

Create a Page with slug `contact` containing:
- HeroSection
- OfficesSection (mapCenterLat: 33, mapCenterLng: 108, mapZoom: 5)
- ContactForm

- [ ] **Step 3: Verify the page renders correctly**

Navigate to `/en/contact` and `/zh/contact`
Expected: Office data comes from Strapi Office collection, contact info from Global

- [ ] **Step 4: Commit**

```bash
git add frontend/app/[locale]/contact/page.tsx
git commit -m "refactor: Contact page uses GenericPage with OfficesSection"
```

---

### Task 20: Update Homepage fallback to use Strapi data

**Files:**
- Modify: `frontend/app/[locale]/page.tsx`

- [ ] **Step 1: Update homepage fallback path to use Strapi data**

In the homepage fallback (when no `home` Page exists in Strapi), replace the current pattern of passing i18n strings to components with fetching data from Strapi:

- Replace `CompanyStats` with data from `getStats(locale)`
- Replace `ClientLogos` with data from `getClients(locale)`
- Replace `AnimatedHero` nodes with data from a HeroSection's products field (or keep as a separate fetch)

This ensures the homepage works even without a Strapi `home` Page, but still pulls data from Strapi collections.

- [ ] **Step 2: Verify homepage renders in both paths**

Path A: With Strapi `home` Page → Dynamic Zone rendering
Path B: Without → Fallback with Strapi collection data

- [ ] **Step 3: Commit**

```bash
git add frontend/app/[locale]/page.tsx
git commit -m "refactor: Homepage fallback uses Strapi collections for stats, clients, hero nodes"
```

---

## Layer 4 — Cleanup

### Task 21: Strip i18n JSON of business content

**Files:**
- Modify: `frontend/messages/en.json`
- Modify: `frontend/messages/zh.json`
- Modify: `frontend/messages/fr.json`
- Modify: `frontend/messages/de.json`
- Modify: `frontend/messages/es.json`
- Modify: `frontend/messages/ru.json`

- [ ] **Step 1: Identify and remove business content from en.json**

Remove these namespaces/keys that contain business content now managed by Strapi:
- `Home.heroTitle`, `Home.heroSubtitle`, `Home.heroSlogan`, `Home.statsTitle`, `Home.statsSubtitle`, `Home.clientsTitle`
- `About.motto`, `About.values.*`, `About.whyChooseUs.*`
- `ContactPage.ctaTitle`, `ContactPage.ctaSubtitle`
- Any other marketing copy keys

Keep only UI chrome:
- `Common.*` (readMore, contactUs, viewAll, etc.)
- `Pagination.*`
- `Breadcrumb.*`
- `Form.*`
- `ProductPage.*` (section labels like "Specifications")
- `NewsPage.*` (publishedOn, byAuthor)
- `Footer.copyright`

- [ ] **Step 2: Apply same changes to all 6 locale files**

Mirror the key removals in zh.json, fr.json, de.json, es.json, ru.json.

- [ ] **Step 3: Verify no broken translation references**

Run: `cd frontend && npm run build`
Expected: Build succeeds — no missing key errors from removed translations

- [ ] **Step 4: Commit**

```bash
git add frontend/messages/
git commit -m "refactor: strip business content from i18n JSON — only UI chrome remains"
```

---

### Task 22: Delete AboutPage content type and remove dead code

**Files:**
- Delete: `backend/src/api/about-page/` (entire directory)
- Modify: `frontend/lib/strapi.ts` — remove `AboutPageData` interface and `getAboutPageBySlug` function

- [ ] **Step 1: Remove getAboutPageBySlug from strapi.ts**

Find and remove the `AboutPageData` interface and the `getAboutPageBySlug` function. Search for any remaining references to `getAboutPageBySlug` in the frontend and remove them.

- [ ] **Step 2: Delete AboutPage Strapi content type**

```bash
rm -rf backend/src/api/about-page/
```

- [ ] **Step 3: Verify Strapi starts without errors**

Run: `cd backend && npm run develop`
Expected: Strapi starts, AboutPage no longer appears in Content-Type Builder

- [ ] **Step 4: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no references to AboutPage

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: delete AboutPage content type — fully replaced by Page + Dynamic Zone"
```

---

### Task 23: Remove isZh ternary patterns and old hardcoded data

**Files:**
- Modify: `frontend/app/[locale]/products/[slug]/page.tsx` — replace `isZh` ternaries with i18n
- Grep for any remaining `isZh` or `locale === 'zh'` patterns in page components and replace with i18n keys

- [ ] **Step 1: Search for remaining isZh patterns**

Run: `cd frontend && grep -rn "isZh\|locale === 'zh'" app/ components/ --include="*.tsx"`

- [ ] **Step 2: Replace each isZh ternary with i18n key**

For each occurrence found, replace the `isZh ? '中文' : 'English'` pattern with `t('key')` and add the key to the appropriate namespace in all 6 locale JSON files.

- [ ] **Step 3: Verify no isZh patterns remain**

Run: `cd frontend && grep -rn "isZh\|locale === 'zh'" app/ components/ --include="*.tsx"`
Expected: No results (or only in legitimate non-content contexts like date formatting)

- [ ] **Step 4: Commit**

```bash
git add frontend/
git commit -m "refactor: replace all isZh ternary patterns with i18n keys"
```

---

### Task 24: Protect application-categories/sync endpoint

**Files:**
- Modify: `backend/src/api/application-category/controllers/application-category.ts`

- [ ] **Step 1: Add guard to sync endpoint**

Find the `sync` method in the application-category controller. Add a guard that requires a secret token to prevent accidental data destruction:

```typescript
async sync(ctx) {
  const token = ctx.request.header['x-sync-token'];
  if (token !== process.env.SYNC_SECRET) {
    return ctx.forbidden('Invalid sync token. Set SYNC_SECRET env var and pass via X-Sync-Token header.');
  }
  // ... existing sync logic
},
```

- [ ] **Step 2: Add SYNC_SECRET to .env template**

Add `SYNC_SECRET=your-secret-here` to the backend .env documentation.

- [ ] **Step 3: Commit**

```bash
git add backend/src/api/application-category/controllers/application-category.ts
git commit -m "fix: protect application-categories/sync endpoint with token guard"
```

---

### Task 25: Final verification and build

**Files:**
- No code changes — verification only

- [ ] **Step 1: Run full TypeScript check**

Run: `cd frontend && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run production build**

Run: `cd frontend && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Verify all pages render**

Navigate to each page in both `en` and `zh`:
- `/` (homepage)
- `/products`, `/products/[slug]`, `/products/category/[slug]`
- `/rfid-tags`, `/rfid-tags/[slug]`, `/rfid-tags/category/[slug]`
- `/applications`, `/applications/[slug]`, `/applications/category/[slug]`
- `/news`, `/news/[slug]`
- `/support`
- `/sharing`, `/sharing/[slug]`
- `/contact`
- `/about/intro`, `/about/company`, `/about/history`, `/about/honors`

- [ ] **Step 4: Verify no console errors**

Open browser DevTools console on each page
Expected: 0 errors, 0 warnings

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "chore: CMS architecture unification complete — all content managed from Strapi"
```