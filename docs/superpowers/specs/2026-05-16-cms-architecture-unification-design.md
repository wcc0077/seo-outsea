# CMS Architecture Unification Design

Date: 2026-05-16
Status: Approved

## Problem

The seo-outsea frontend has significant hardcoded content that should be managed from Strapi CMS:

1. **About pages** use hardcoded content (timeline, honors, facilities, core values) instead of Strapi Dynamic Zones
2. **Support page** is almost entirely hardcoded Chinese text with no i18n
3. **Contact/Support pages** hardcode phone/email instead of using `Global.contactInfo`
4. **CompanyStats/ClientLogos/OfficesSection/AnimatedHero** have hardcoded data arrays
5. **Seed data** imports Chinese content as `en` locale
6. **Image URLs** point to old domain `pmtdb1c40-pic17.websiteonline.cn`
7. **i18n JSON** contains marketing copy instead of just UI labels

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| CMS control scope | Full CMS control | All business content editable from Strapi |
| Page model | Unified Page + Dynamic Zone | One content type for all pages, CMS editors compose freely |
| Office/Client/Stat | New Strapi content types | Independent collections, not embedded in pages |
| i18n separation | Strict: UI chrome in JSON, business content in Strapi | Content editors never need to edit JSON files |
| Migration approach | Bottom-up: data first, pages second | Fixes most dangerous issues (image URLs, seed data) first |
| AboutPage content type | Deprecated after migration | Replaced by Page with Dynamic Zone |

## Layer 1 — Data Foundation

### New Strapi Content Types

#### Office (collectionType, i18n localized, draftAndPublish)

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | yes | Localized (no name/nameEn split) |
| address | text | no | Localized |
| phone | string | no | |
| phone2 | string | no | |
| fax | string | no | |
| email | email | no | |
| website | string | no | |
| zipCode | string | no | |
| lat | float | no | Map latitude |
| lng | float | no | Map longitude |
| isHQ | boolean | no | Default false |
| sortOrder | integer | no | Default 0 |

Custom endpoints: `GET /offices`, `GET /offices/published`, `POST /offices/import`, `POST /offices/translate`

#### Client (collectionType, i18n localized, draftAndPublish)

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | yes | Client/company name |
| logo | media | yes | Single image |
| sortOrder | integer | no | Default 0 |

Custom endpoints: `GET /clients`, `GET /clients/published`, `POST /clients/import`, `POST /clients/translate`

#### Stat (collectionType, i18n localized, draftAndPublish)

| Field | Type | Required | Notes |
|---|---|---|---|
| value | string | yes | e.g. "19+", "3000+" |
| label | string | yes | Localized, e.g. "年RFID专业经验" / "Years RFID Experience" |
| sortOrder | integer | no | Default 0 |

Custom endpoints: `GET /stats`, `GET /stats/published`, `POST /stats/import`, `POST /stats/translate`

### New Strapi Section Components

#### sections.offices-section

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | no | |
| mapCenterLat | float | no | Default 33 |
| mapCenterLng | float | no | Default 108 |
| mapZoom | integer | no | Default 5 |

Queries `Office` collection at render time (not a relation field).

#### sections.client-logos-section

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | no | |

Queries `Client` collection at render time.

#### sections.certificate-gallery-section

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | no | |
| certificates | component[] (shared.certificate-item) | no | Repeatable |

#### shared.certificate-item

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | yes | |
| image | media | no | Single image |
| category | enumeration | no | qualification / certification / ip |

#### shared.product-node

| Field | Type | Required | Notes |
|---|---|---|---|
| label | string | yes | Product label shown under node |
| image | media | yes | Product thumbnail image |

#### HeroSection update

Add repeatable `products` component field (shared.product-node) to sections.hero-section so CMS editors can configure which products appear in the AnimatedHero network visualization.

### Dynamic Zone Update

Add 3 new components to Page's `sections` dynamiczone allowed list:
- `sections.offices-section`
- `sections.client-logos-section`
- `sections.certificate-gallery-section`

### Seed Data Locale Fix

- Import Chinese content as `zh` locale (not `en`)
- Add locale validation to import endpoints: reject if locale param doesn't match content language
- `en` locale versions created via `/translate` endpoint or manually in Strapi admin

### Image Migration

- Download all 30+ old-domain images from `pmtdb1c40-pic17.websiteonline.cn`
- Upload to Strapi Media library
- Update all references to use Strapi media URLs
- AnimatedHero NODES images become Strapi media (passed as props)

## Layer 2 — Frontend Data Layer

### strapi.ts Additions

```typescript
// New fetch functions
getOffices(locale: string): Promise<OfficeData[]>
getClients(locale: string): Promise<ClientData[]>
getStats(locale: string): Promise<StatData[]>

// New interfaces
interface OfficeData {
  name: string; address: string; phone: string; phone2?: string;
  fax?: string; email?: string; website?: string; zipCode?: string;
  lat: number; lng: number; isHQ: boolean; sortOrder: number;
}

interface ClientData {
  name: string; logo: { url: string }; sortOrder: number;
}

interface StatData {
  value: string; label: string; sortOrder: number;
}
```

### Component Updates

| Component | Change |
|---|---|
| CompanyStats | Accept `stats: StatData[]` prop or query Stat collection. Remove hardcoded STATS array. |
| ClientLogos | Accept `clients: ClientData[]` prop or query Client collection. Remove hardcoded CLIENT_LOGOS array. |
| OfficesSection | Accept `offices: OfficeData[]` prop or query Office collection. Remove hardcoded OFFICES array. |
| AnimatedHero | Accept `nodes: NetworkNode[]` prop from parent HeroSection. The HeroSection component gets new repeatable `products` component field (shared.product-node: label + image media) so CMS editors can configure which products appear in the network visualization. Remove hardcoded NODES array. |
| Contact page | Use `Global.contactInfo` for phone/email. Remove hardcoded `4000-56-5516` and `sales@fn-tech.com`. |
| Support page | Replace all hardcoded Chinese with i18n + Strapi data. Use `Global.contactInfo` for contact section. |

### Global.contactInfo Unification

All contact info references use `Global.contactInfo` as single source:
- Footer (already uses it)
- Contact page (switch from hardcoded)
- Support page (switch from hardcoded)
- Office-specific phones come from `Office` collection

## Layer 3 — Page Migration

Each page migrates from its current implementation to `Page(slug:xxx)` with Dynamic Zone rendering via `GenericPage`.

### Migration Map

| Route | Current Source | Target Page Slug | Dynamic Zone Sections |
|---|---|---|---|
| `/about/intro` | AboutPage(pageType:intro) + hardcoded | `about-intro` | HeroSection, StatsSection, TextImage (3x), TextImage (motto), TextImage (values), TextImage (whyChooseUs x4), TextImage (CTA) |
| `/about/company` | AboutPage(pageType:gallery) + hardcoded facilities | `about-company` | HeroSection, TextImage (6 facilities), StatsSection |
| `/about/history` | AboutPage(pageType:history) + hardcoded timeline | `about-history` | HeroSection, TextImage (10 timeline events) |
| `/about/honors` | AboutPage(pageType:honors) + hardcoded certificates | `about-honors` | HeroSection, CertificateGallerySection |
| `/support` | Hardcoded Chinese | `support` | HeroSection, TextImage (4 cards), TextImage (contact info), FAQSection |
| `/contact` | Partially hardcoded | `contact` | HeroSection, OfficesSection, ContactForm |

### Frontend Route Simplification

```typescript
// Before: each page has unique hardcoded layout (~300 lines)
export default async function AboutIntroPage({ params }) {
  // ... hardcoded values, fallback sections, isZh ternaries
}

// After: all pages use GenericPage (~10 lines)
export default async function AboutIntroPage({ params }) {
  const { locale } = await params;
  const page = await getPageBySlug('about-intro', locale);
  if (!page) return notFound();
  return <GenericPage page={page} locale={locale} />;
}
```

### SectionRenderer Update

Add mappings for new section components in `SECTION_COMPONENT_MAP`:

```typescript
'sections.offices-section': OfficesSection,
'sections.client-logos-section': ClientLogos,
'sections.certificate-gallery-section': CertificateGallery,
```

## Layer 4 — Cleanup

1. Strip i18n JSON of business content (keep only UI chrome: Common, Pagination, Breadcrumb, Form, ProductPage labels, NewsPage labels)
2. Delete AboutPage content type from Strapi
3. Remove `getAboutPageBySlug()` from strapi.ts
4. Remove `parseStrapiContent()` and `getFallbackSections()` from about pages
5. Remove `application-categories/sync` destructive endpoint or add protection guard
6. Remove old-domain image URL references from all components
7. Remove `isZh` ternary patterns — all content comes from Strapi i18n

## i18n JSON Content After Cleanup

Only UI chrome remains in `messages/*.json`:

```
Common: readMore, contactUs, viewAll, learnMore, back, home, loading, noResults, searchPlaceholder
Pagination: previous, next, page, of
Breadcrumb: home
Form: namePlaceholder, emailPlaceholder, messagePlaceholder, submitButton, sending, sent, error
ProductPage: specifications, fullSpecs, rfidFrequency, operatingSystem, needConsultation, ourExpertTeam
NewsPage: publishedOn, byAuthor
Footer: copyright (template with siteName from Strapi)
```

All marketing copy (hero titles, company motto, core values, whyChooseUs points, support card descriptions) moves to Strapi Page content.

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Old-domain images unavailable during download | Download first, verify all succeed, then upload to Strapi |
| Seed data locale fix breaks existing data | Run on fresh DB; existing DBs keep current locale assignments |
| AboutPage removal breaks admin panel | Keep AboutPage during Layer 3, only delete in Layer 4 after all pages migrated |
| Dynamic Zone pages need Strapi seeding | Create import endpoints for each new Page slug with section data |
| Client/Office/Stat collections empty on first deploy | Import endpoints seed initial data from current hardcoded values |