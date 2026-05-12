# About Intro Page Redesign — Design Spec

## Overview

Redesign the `/about/intro` page (孚恩简介) to incorporate content from the reference site (https://www.fn-tech.com/about-us.html) including: 司训 (motto), 价值观 (values), 使命 (mission), 愿景 (vision), and 选择孚恩的理由 (why choose FN Tech — 4 pillars).

## Approach: Fusion Reorganization (方案 C)

Eliminate redundancy between existing "企业资质" and new "选择孚恩的理由" by replacing the former with the richer, data-driven latter. Page flow follows a trust-building narrative: identity → values → capabilities → proof → action.

## Page Structure (Top to Bottom)

### 1. Hero Section
- **Purpose**: Immediate brand identity hook
- **Content**: Title + subtitle
  - Subtitle merges the existing tagline with mission/vision for stronger emotional impact:
    - zh: "专注 RFID 硬件研发与制造，助力全球工业智能化升级 —— 幸福员工，感动客户"
    - en: "Focused on RFID hardware R&D and manufacturing — Happy employees, inspired customers"
- **Visual**: Keep existing gradient + concentric circles background
- **Changes from current**: Subtitle wording only

### 2. 企业概况 (Company Overview)
- **Purpose**: Establish credibility with hard facts
- **Content**: Existing paragraphs (成立年份、注册资金、基地面积、业务范围)
- **Stats bar**: Keep existing 4 stat cards (2006 / 2002万 / 3000+ / 70+)
- **New addition**: Bottom of section, add 司训 (motto) as a centered pull-quote:
  - zh: "有孚盈缶，知恩允能"
  - en: "With trust we prosper, with gratitude we empower"
  - Visual: Large serif-style display text, subtle border or quotation mark decoration, muted color
- **Changes from current**: + 司训 pull-quote at bottom

### 3. 核心价值观 (Core Values) — NEW SECTION
- **Purpose**: Brand personality and cultural identity
- **Content**: 6 values in a 3×2 grid (desktop) / 2×3 (mobile):
  - 诚信 (Integrity)
  - 利他 (Altruism)
  - 感恩 (Gratitude)
  - 勤奋 (Diligence)
  - 专业 (Professionalism)
  - 责任 (Responsibility)
- **Visual**: Each value is a card with:
  - A single Chinese character as large display text (or English equivalent for `en` locale)
  - Value name below
  - No lengthy descriptions — the character itself is the content
  - Subtle hover: border color shift to primary, slight scale-up
  - Background: slightly elevated card on neutral surface
- **i18n**: Use `next-intl` translation keys: `About.values.integrity`, `About.values.altruism`, etc.
- **Placement**: Between 企业概况 and 核心能力 — values shape how capabilities are perceived

### 4. 核心能力 (Core Capabilities)
- **Purpose**: What we make
- **Content**: Keep EXACTLY as-is — 4 product-line cards (RFID 读写设备, 天线与模块, 手持终端, 软件中间件)
- **No changes**

### 5. 研发实力 (R&D Strength)
- **Purpose**: How we build it
- **Content**: Keep EXACTLY as-is — paragraph about R&D team, education level, testing environment
- **No changes**

### 6. 选择孚恩的理由 (Why Choose FN Tech) — REPLACES 企业资质
- **Purpose**: Social proof and competitive differentiation
- **Content**: 4 pillars, each with a title, 3 bullet points of specific evidence, and an icon:

  **Pillar 1 — 企业实力 / Enterprise Strength**
  - 4000平米研发生产基地，2000多万注册资金
  - 100余人专业团队，资深博士带队
  - 30多项荣誉奖项并承担多个组织社会责任

  **Pillar 2 — 产品品质 / Product Quality**
  - 300多万研发测试设备，逐台全检，确保品质一致性
  - 来料检、部件检、半成品检、成品检、老化测试，层层把关
  - 通过 ISO9001/ISO14001 等权威认证，从体系上保障产品品质

  **Pillar 3 — 研发技术 / R&D Technology**
  - 来自 TI 等一流大企业或 985 高校的资深研发团队专注自主研发创新
  - 18年 RFID 物联网硬件研发经验，70多项专利，积跬步以成千里
  - 众多模块化设计的产品基础，可低成本快速个性化定制

  **Pillar 4 — 专业服务 / Professional Service**
  - 售前多方位技术咨询，专家上门服务，以提供整体解决方案的心态营销硬件产品
  - 售中流程化作业，ERP系统+专职商务跟单，高效下单供货，及时主动反馈
  - 售后24小时服务热线快速响应，多种质保，创新独特的"RFID智库"互动分享

- **Visual**: 2×2 grid (desktop) / 1-column stack (mobile). Each pillar is a card with:
  - Icon in top-left (from Heroicons set, consistent with existing icons)
  - Title with accent color
  - 3 bullet points, small text
  - Slightly different background tint per card (or uniform — TBD in implementation)
  - Entrance animation: staggered fade-in on scroll

- **Changes from current**: Replaces the flat 8-item badge grid of "企业资质". All former certifications (高新技术企业, 专精特新, ISO9001, ISO14001, CCC, 双软, 知识产权) are mentioned within these pillars with more context.

### 7. CTA Section
- **Purpose**: Drive next action
- **Content**: Keep EXACTLY as-is — "了解更多产品信息" + two buttons (View Products / Contact Us)
- **No changes**

## What Is Removed

The existing "企业资质" flat badge grid (8 items) is removed. Its information is preserved and enriched within "选择孚恩的理由" pillars 1–3.

## What Is Added

| Section | Status | Content |
|---------|--------|---------|
| Hero subtitle | Modified | Merge mission into tagline |
| 企业概况 | Enhanced | + 司训 pull-quote |
| 核心价值观 | New | 6 value cards in grid |
| 选择孚恩的理由 | New (replaces 企业资质) | 4 evidence-rich pillars |

## Data Flow

- All text content is hardcoded with `isZh` / `isEn` branching (same pattern as current page)
- Translation keys for values section should be added to `messages/zh.json` and `messages/en.json`
- Strapi `about-page` content type remains as optional override for title only; body content is hardcoded for reliability

## Responsive Behavior

- Values grid: 3 columns → 2 columns → 1 column
- Why Choose grid: 2 columns → 1 column
- Stats bar: 4 columns → 2 columns → 1 column (already exists)
- All padding/margins scale with existing `sm:px-6 lg:px-8` pattern

## File Changes

| File | Action |
|------|--------|
| `frontend/app/[locale]/about/intro/page.tsx` | Major rewrite — restructure sections, add new content |
| `frontend/messages/zh.json` | Add `About.values.*` keys |
| `frontend/messages/en.json` | Add `About.values.*` keys |

## Accessibility

- All new sections use semantic `<section>` tags with heading hierarchy
- Icons have `aria-hidden="true"`
- Color contrast maintained against dark neutral backgrounds
- No reliance on color alone to convey meaning

## Performance

- No new external dependencies
- All content is static (server component) — zero client JS for content
- Existing lazy-loaded images pattern preserved

## Open Questions (None)

All content, structure, and visual approach are specified. Ready for implementation.
