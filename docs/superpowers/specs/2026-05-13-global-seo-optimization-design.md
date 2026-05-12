# Global SEO + Performance Optimization Design

## Context

FN Tech website uses Next.js 15 (App Router) + Strapi 5 headless CMS with i18n support (en, zh). Current issues:

- No dynamic sitemap generation
- Static robots.txt not geo-friendly
- Incomplete meta tags and no structured data for rich results
- No LLM crawler considerations
- Content has regional variants (contact info, product availability)

## Goals

1. Generate multi-language sitemap with proper hreflang annotations
2. Make robots.txt geo-friendly for Google, Bing, Baidu, Yandex + LLM crawlers
3. Comprehensive technical SEO (meta tags, structured data, Open Graph)
4. Performance optimization with ISR caching strategy
5. Support regional content variants

## Architecture

### 1. Multi-Language Sitemap (ISR)

**File**: `frontend/app/sitemap.ts`

```
sitemap.xml                    → Main sitemap index
├── sitemap-products-en.xml
├── sitemap-products-zh.xml
├── sitemap-applications-en.xml
├── sitemap-applications-zh.xml
├── sitemap-news-en.xml
├── sitemap-news-zh.xml
├── sitemap-static-en.xml      → About, Support, Contact
└── sitemap-static-zh.xml
```

**hreflang Strategy**:
- `en`, `zh` — language-specific pages
- `x-default` — points to default language version (English)
- Each page includes all language variants via `<xhtml:link>`

**ISR Revalidation**:
| Content Type | Revalidate | Reason |
|--------------|------------|--------|
| Products | 1 hour | Frequent updates |
| Applications | 1 hour | Moderate updates |
| News | 5 minutes | Time-sensitive |
| Static pages | 24 hours | Rarely changes |

### 2. Geo-Friendly Robots.txt

**File**: `frontend/app/robots.ts`

```
User-agent: *
Allow: /

# Major Search Engines
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 1

User-agent: Baiduspider
Crawl-delay: 2

User-agent: YandexBot
Crawl-delay: 1

# LLM Crawlers (Training + RAG)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: GoogleExtended
Allow: /

User-agent: CCBot
Allow: /

# Sitemaps
Sitemap: https://fn-tech.com/sitemap.xml
Sitemap: https://fn-tech.com/sitemap-zh.xml
```

### 3. SEO Components

**Files**:
- `frontend/components/seo/MetaTags.tsx` (upgrade)
- `frontend/components/seo/JsonLd.tsx` (extend)
- `frontend/components/seo/StructuredData.tsx` (new)

**MetaTags Upgrades**:
- Twitter Cards (summary_large_image)
- Dublin Core metadata
- Mobile viewport optimization
- Enhanced Open Graph with article:published_time

**JSON-LD Structured Data**:

| Type | Pages | Purpose |
|------|-------|---------|
| Organization | All | Brand identity |
| WebSite + SearchAction | All | Site search box |
| Product | Product detail | Rich product snippets |
| Article | News | Article metadata |
| BreadcrumbList | All | Navigation path |
| FAQPage | Support page | FAQ rich results |

### 4. Performance Optimization

**Image Optimization**:
- Use Next.js `<Image>` with WebP/AVIF automatic conversion
- Responsive srcset for different viewports
- Lazy loading for below-fold images

**ISR Configuration**:
```typescript
// In strapi.ts fetch options
{ next: { revalidate: 3600 } }  // 1 hour default
{ next: { revalidate: 300 } }   // 5 minutes for news
```

**Font Optimization**:
- Use `next/font` for automatic font optimization
- Subset fonts to used characters

### 5. Regional Content Support

**Contact Info by Region**:
- North America: US office contact
- China: CN office contact
- Europe: DE office contact
- Each locale loads region-appropriate contact data

**Product Availability by Region** (future):
- Some products may be region-specific
- Handled via Strapi field + conditional rendering

## Files to Create/Modify

### New Files
- `frontend/app/sitemap.ts` — Main sitemap generator
- `frontend/app/sitemap-others.ts` — Static pages sitemap
- `frontend/app/robots.ts` — Dynamic robots.txt
- `frontend/components/seo/StructuredData.tsx` — Structured data components
- `frontend/lib/seo-config.ts` — SEO constants

### Modified Files
- `frontend/components/seo/MetaTags.tsx` — Add Twitter Cards, Dublin Core
- `frontend/components/seo/JsonLd.tsx` — Extend with more types
- `frontend/app/[locale]/layout.tsx` — Enhanced metadata
- `frontend/lib/strapi.ts` — Add revalidate config

## Verification

1. Sitemap validates at `sitemap.xml` and `sitemap-zh.xml`
2. robots.txt accessible at `/robots.txt`
3. All pages have proper meta tags and structured data
4. hreflang tags correct in page `<head>`
5. Google Search Console shows no errors
6. PageSpeed score > 90
