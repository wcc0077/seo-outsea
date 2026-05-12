# About Intro Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/about/intro` page to incorporate 司训, 价值观, 使命, 愿景, and 选择孚恩的理由 from the reference site, reorganizing content for a trust-building narrative flow.

**Architecture:** Single Next.js server page component with hardcoded bilingual content (existing pattern). Add 6 value cards and a 4-pillar "Why Choose Us" grid to replace the flat qualification badges. All changes are in one page file plus i18n message additions.

**Tech Stack:** Next.js 15 App Router, React Server Components, Tailwind CSS, next-intl, Heroicons (existing inline SVG pattern)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `frontend/app/[locale]/about/intro/page.tsx` | Rewrite | Main page with all sections |
| `frontend/messages/zh.json` | Modify | Add `About.values.*` translation keys |
| `frontend/messages/en.json` | Modify | Add `About.values.*` translation keys |

---

### Task 1: Add i18n translation keys for values

**Files:**
- Modify: `frontend/messages/zh.json`
- Modify: `frontend/messages/en.json`

- [ ] **Step 1: Add values keys to zh.json**

  In `frontend/messages/zh.json`, find the `"About"` object (around line 78) and add a `"values"` object inside it:

  ```json
  "About": {
    "intro": "孚恩简介",
    "gallery": "公司实景",
    "history": "发展历程",
    "honors": "荣誉资质",
    "values": {
      "title": "核心价值观",
      "subtitle": "CORE VALUES",
      "integrity": "诚信",
      "altruism": "利他",
      "gratitude": "感恩",
      "diligence": "勤奋",
      "professionalism": "专业",
      "responsibility": "责任"
    },
    "motto": "有孚盈缶，知恩允能",
    "whyChooseUs": {
      "title": "选择孚恩的理由",
      "subtitle": "WHY CHOOSE US",
      "strength": {
        "title": "企业实力",
        "points": [
          "4000平米研发生产基地，2000多万注册资金",
          "100余人专业团队，资深博士带队",
          "30多项荣誉奖项并承担多个组织社会责任"
        ]
      },
      "quality": {
        "title": "产品品质",
        "points": [
          "300多万研发测试设备，逐台全检，确保品质一致性",
          "来料检、部件检、半成品检、成品检、老化测试，层层把关",
          "通过 ISO9001/ISO14001 等权威认证，从体系上保障产品品质"
        ]
      },
      "technology": {
        "title": "研发技术",
        "points": [
          "来自 TI 等一流大企业或 985 高校的资深研发团队专注自主研发创新",
          "18年 RFID 物联网硬件研发经验，70多项专利，积跬步以成千里",
          "众多模块化设计的产品基础，可低成本快速个性化定制"
        ]
      },
      "service": {
        "title": "专业服务",
        "points": [
          "售前多方位技术咨询，专家上门服务，以提供整体解决方案的心态营销硬件产品",
          "售中流程化作业，ERP系统+专职商务跟单，高效下单供货，及时主动反馈",
          "售后24小时服务热线快速响应，多种质保，创新独特的\"RFID智库\"互动分享"
        ]
      }
    }
  },
  ```

- [ ] **Step 2: Add values keys to en.json**

  In `frontend/messages/en.json`, find the `"About"` object (around line 78) and add:

  ```json
  "About": {
    "intro": "About FN",
    "gallery": "Company Scene",
    "history": "History",
    "honors": "Honors & Certs",
    "values": {
      "title": "Core Values",
      "subtitle": "CORE VALUES",
      "integrity": "Integrity",
      "altruism": "Altruism",
      "gratitude": "Gratitude",
      "diligence": "Diligence",
      "professionalism": "Professionalism",
      "responsibility": "Responsibility"
    },
    "motto": "With trust we prosper, with gratitude we empower",
    "whyChooseUs": {
      "title": "Why Choose FN Tech",
      "subtitle": "WHY CHOOSE US",
      "strength": {
        "title": "Enterprise Strength",
        "points": [
          "4,000 sqm R&D and production base with over 20 million RMB registered capital",
          "100+ professional team members led by senior PhDs",
          "30+ honors and awards with active corporate social responsibility"
        ]
      },
      "quality": {
        "title": "Product Quality",
        "points": [
          "3+ million RMB in R&D testing equipment, 100% inspection per unit",
          "Incoming, component, semi-finished, finished, and burn-in testing at every stage",
          "ISO9001/ISO14001 certified, quality assured through systematic processes"
        ]
      },
      "technology": {
        "title": "R&D Technology",
        "points": [
          "Senior R&D team from top enterprises like TI and top 985 universities",
          "18 years of RFID IoT hardware R&D experience, 70+ patents",
          "Modular product design enabling low-cost rapid customization"
        ]
      },
      "service": {
        "title": "Professional Service",
        "points": [
          "Pre-sales technical consulting with expert on-site visits and total solution mindset",
          "Process-driven operations with ERP + dedicated account managers for efficient delivery",
          "24-hour hotline support, multiple warranty options, unique RFID Knowledge Hub"
        ]
      }
    }
  },
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/messages/zh.json frontend/messages/en.json
  git commit -m "feat(i18n): add About values and whyChooseUs translation keys"
  ```

---

### Task 2: Rewrite the about intro page

**Files:**
- Rewrite: `frontend/app/[locale]/about/intro/page.tsx`

- [ ] **Step 1: Replace the entire page file**

  Write the complete rewritten page to `frontend/app/[locale]/about/intro/page.tsx`:

  ```tsx
  import { getTranslations } from 'next-intl/server';
  import Link from 'next/link';
  import { getAboutPageBySlug } from '@/lib/strapi';
  import Breadcrumb from '@/components/ui/Breadcrumb';

  export default async function AboutIntroPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });

    const strapiData = await getAboutPageBySlug('company-intro', locale);
    const isZh = locale === 'zh';

    const heroTitle = strapiData?.title || (isZh ? '关于孚恩' : 'About FN Tech');
    const heroSubtitle = isZh
      ? '专注 RFID 硬件研发与制造，助力全球工业智能化升级 —— 幸福员工，感动客户'
      : 'Focused on RFID hardware R&D and manufacturing — Happy employees, inspired customers';

    const sections = strapiData
      ? parseStrapiContent(strapiData.content)
      : getFallbackSections(isZh);

    const values = isZh
      ? [
          { char: '诚', name: t('values.integrity') },
          { char: '利', name: t('values.altruism') },
          { char: '恩', name: t('values.gratitude') },
          { char: '勤', name: t('values.diligence') },
          { char: '专', name: t('values.professionalism') },
          { char: '责', name: t('values.responsibility') },
        ]
      : [
          { char: 'I', name: t('values.integrity') },
          { char: 'A', name: t('values.altruism') },
          { char: 'G', name: t('values.gratitude') },
          { char: 'D', name: t('values.diligence') },
          { char: 'P', name: t('values.professionalism') },
          { char: 'R', name: t('values.responsibility') },
        ];

    const whyChooseUs = isZh
      ? [
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            title: t('whyChooseUs.strength.title'),
            points: t.raw('whyChooseUs.strength.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            ),
            title: t('whyChooseUs.quality.title'),
            points: t.raw('whyChooseUs.quality.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            ),
            title: t('whyChooseUs.technology.title'),
            points: t.raw('whyChooseUs.technology.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            ),
            title: t('whyChooseUs.service.title'),
            points: t.raw('whyChooseUs.service.points') as string[],
          },
        ]
      : [
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            title: t('whyChooseUs.strength.title'),
            points: t.raw('whyChooseUs.strength.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            ),
            title: t('whyChooseUs.quality.title'),
            points: t.raw('whyChooseUs.quality.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            ),
            title: t('whyChooseUs.technology.title'),
            points: t.raw('whyChooseUs.technology.points') as string[],
          },
          {
            icon: (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            ),
            title: t('whyChooseUs.service.title'),
            points: t.raw('whyChooseUs.service.points') as string[],
          },
        ];

    return (
      <>
        {/* ── Hero ── */}
        <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="relative w-[600px] h-[600px]">
              <div className="absolute inset-0 rounded-full border border-primary-500/10" />
              <div className="absolute inset-12 rounded-full border border-primary-500/8" />
              <div className="absolute inset-24 rounded-full border border-primary-500/5" />
            </div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold mb-5">{heroTitle}</h1>
            <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">{heroSubtitle}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-900 to-transparent" aria-hidden="true" />
        </section>

        <Breadcrumb locale={locale} items={[
          { label: isZh ? '关于孚恩' : 'About' },
          { label: isZh ? '孚恩简介' : 'Company Intro' },
        ]} />

        {/* ── Company Overview ── */}
        {sections.map((section, idx) => (
          <section key={idx} className={`py-20 ${idx % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-950'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">{section.subtitle}</div>
                <h2 className="text-3xl font-bold text-white">{section.title}</h2>
              </div>

              {'stats' in section && section.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  {section.stats.map((stat, i) => (
                    <div key={i} className="text-center p-6 rounded-xl bg-neutral-800/50 border border-neutral-700/30">
                      <div className="text-3xl font-bold text-primary-400 mb-1">{stat.value}</div>
                      <div className="text-sm text-neutral-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {'content' in section && section.content && (
                <div className="max-w-3xl">
                  {section.content.split('\n').map((p, i) => (
                    <p key={i} className="text-neutral-300 leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
              )}

              {'items' in section && section.items && section.items.length > 0 && 'text' in section.items[0] ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.items.map((item, i) => {
                    const badgeItem = item as { icon: string; text: string };
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/30">
                        <svg className="w-5 h-5 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm text-neutral-200">{badgeItem.text}</span>
                      </div>
                    );
                  })}
                </div>
              ) : 'items' in section && section.items && section.items.length > 0 && 'title' in section.items[0] ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items.map((item, i) => {
                    const cardItem = item as { icon: string; title: string; description: string };
                    return (
                      <div key={i} className="p-6 rounded-xl bg-neutral-800/50 border border-neutral-700/30 hover:border-primary-500/30 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4">
                          {cardItem.icon === 'chip' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          )}
                          {cardItem.icon === 'antenna' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                          )}
                          {cardItem.icon === 'handheld' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                          )}
                          {cardItem.icon === 'software' && (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                            </svg>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1">{cardItem.title}</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed">{cardItem.description}</p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>
        ))}

        {/* ── Motto Pull-quote ── */}
        <section className="py-16 bg-neutral-950 border-y border-neutral-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-6xl md:text-7xl font-serif text-primary-500/20 leading-none mb-4" aria-hidden="true">"</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-white tracking-wide">
              {t('motto')}
            </blockquote>
            <div className="mt-6 w-16 h-0.5 bg-primary-500/40 mx-auto" />
          </div>
        </section>

        {/* ── Core Values ── */}
        <section className="py-20 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">{t('values.subtitle')}</div>
              <h2 className="text-3xl font-bold text-white">{t('values.title')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="group text-center p-8 rounded-xl bg-neutral-800/40 border border-neutral-700/30 hover:border-primary-500/40 hover:bg-neutral-800/60 transition-all duration-300"
                >
                  <div className="text-5xl font-bold text-primary-400/80 group-hover:text-primary-400 transition-colors mb-3">
                    {v.char}
                  </div>
                  <div className="text-sm font-semibold text-neutral-200 tracking-wider">{v.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-20 bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">{t('whyChooseUs.subtitle')}</div>
              <h2 className="text-3xl font-bold text-white">{t('whyChooseUs.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseUs.map((pillar, i) => (
                <div
                  key={i}
                  className="p-8 rounded-xl bg-neutral-900/60 border border-neutral-700/30 hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                      {pillar.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {pillar.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-neutral-400 leading-relaxed">
                        <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-neutral-900 border-t border-neutral-800/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {isZh ? '了解更多产品信息' : 'Learn More About Our Products'}
            </h3>
            <p className="text-neutral-400 mb-8">
              {isZh ? '探索我们完整的 RFID 产品线和行业应用解决方案' : 'Explore our full range of RFID products and industry solutions'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-primary-600/30 hover:shadow-xl transition-all duration-300"
              >
                {isZh ? '查看产品' : 'View Products'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 border border-neutral-600 text-neutral-300 hover:text-white hover:border-neutral-500 font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                {isZh ? '联系我们' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ── Fallback data when Strapi is not available ── */

  type Section = {
    title: string;
    subtitle: string;
    content?: string;
    stats?: Array<{ value: string; label: string }>;
    items?: Array<{ icon: string; title?: string; description?: string; text?: string }>;
  };

  function getFallbackSections(isZh: boolean): Section[] {
    return isZh
      ? [
          {
            title: '企业概况',
            subtitle: 'OVERVIEW',
            content: `上海孚恩电子科技有限公司成立于2006年，注册资金2002万元，是国内最早专业从事RFID与物联网技术研发的企业之一。公司坐落于上海市闵行区漕河泾浦江高科技园国家863软件孵化器基地，拥有3000多平方米的研发与生产基地。

  孚恩电子专注于RFID自动识别、自动数据采集和物联网领域的软硬件研发、生产和销售，主要产品涵盖各频段RFID读写设备（固定式和手持式）、RFID手持机、智能终端、RFID电子芯片、蓝牙RFID扫描器等工业识别产品与解决方案。`,
            stats: [
              { value: '2006', label: '成立年份' },
              { value: '2002万', label: '注册资金' },
              { value: '3000+', label: '平方米基地' },
              { value: '70+', label: '知识产权' },
            ],
          },
          {
            title: '核心能力',
            subtitle: 'CORE CAPABILITIES',
            items: [
              { icon: 'chip', title: 'RFID 读写设备', description: 'HF/UHF 全频段读写器，支持 IO-Link、ModbusTCP、以太网等工业协议' },
              { icon: 'antenna', title: '天线与模块', description: '高性能 RFID 天线设计，满足不同场景的读取需求' },
              { icon: 'handheld', title: '手持终端', description: '工业级安卓手持终端，支持条码/RFID 双模识别' },
              { icon: 'software', title: '软件中间件', description: 'RFID 数据管理平台，提供完整的行业应用解决方案' },
            ],
          },
          {
            title: '研发实力',
            subtitle: 'R&D STRENGTH',
            content: `公司拥有一支高素质的研发团队，核心成员在RFID行业拥有超过15年的技术积累。研发团队60%以上具有硕士学历，具备从芯片选型、电路设计、固件开发、天线设计到应用软件的全栈研发能力。

  公司拥有完善的RFID测试环境和生产线，确保产品从设计到量产的每一个环节都经过严格的品质控制。`,
          },
        ]
      : [
          {
            title: 'Company Overview',
            subtitle: 'OVERVIEW',
            content: `Shanghai Fuen Electronic Technology Co., Ltd. was established in 2006 with a registered capital of 20.02 million RMB. It is one of the earliest enterprises in China specializing in RFID and IoT technology R&D. The company is located in the National 863 Software Incubator Base, Caohejing Pujiang Hi-Tech Park, Minhang District, Shanghai, with an R&D and production base of over 3,000 square meters.

  FN Tech focuses on RFID automatic identification, data collection, and IoT hardware/software R&D, production, and sales. Main products cover RFID readers (fixed and handheld), RFID handheld terminals, smart terminals, RFID electronic chips, Bluetooth RFID scanners, and other industrial identification products and solutions.`,
            stats: [
              { value: '2006', label: 'Founded' },
              { value: '20.02M', label: 'Registered Capital' },
              { value: '3000+', label: 'sqm Facility' },
              { value: '70+', label: 'IP Rights' },
            ],
          },
          {
            title: 'Core Capabilities',
            subtitle: 'CORE CAPABILITIES',
            items: [
              { icon: 'chip', title: 'RFID Readers', description: 'HF/UHF full-band readers supporting IO-Link, ModbusTCP, Ethernet protocols' },
              { icon: 'antenna', title: 'Antennas & Modules', description: 'High-performance RFID antenna design for diverse application scenarios' },
              { icon: 'handheld', title: 'Handheld Terminals', description: 'Industrial-grade Android handheld terminals with barcode/RFID dual-mode' },
              { icon: 'software', title: 'Software Middleware', description: 'RFID data management platform providing complete industry solutions' },
            ],
          },
          {
            title: 'R&D Strength',
            subtitle: 'R&D STRENGTH',
            content: `The company has a high-quality R&D team with core members having over 15 years of technical accumulation in the RFID industry. More than 60% of the R&D team hold master's degrees, with full-stack R&D capabilities from chip selection, circuit design, firmware development, antenna design to application software.

  The company has a complete RFID testing environment and production line, ensuring that every stage from design to mass production undergoes strict quality control.`,
          },
        ];
  }

  function parseStrapiContent(content: string): Section[] {
    const parts = content.split(/^## /m).filter(Boolean);
    if (parts.length === 0) return [];

    const title = parts[0].split('\n')[0].replace(/^# /, '').trim();
    const contentLines = parts[0].split('\n').slice(1).filter(Boolean).join('\n');

    return [
      { title, subtitle: '', content: contentLines },
      ...parts.slice(1).map((part) => {
        const lines = part.split('\n');
        return { title: lines[0].trim(), subtitle: '', content: lines.slice(1).filter(Boolean).join('\n') };
      }),
    ];
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  Run:
  ```bash
  cd frontend && npx tsc --noEmit
  ```
  Expected: No errors.

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/app/[locale]/about/intro/page.tsx
  git commit -m "feat(about): redesign intro page with motto, values, and why-choose-us"
  ```

---

### Task 3: Verify the build

- [ ] **Step 1: Build the frontend**

  Run:
  ```bash
  cd frontend && npm run build
  ```
  Expected: Build succeeds with no errors.

- [ ] **Step 2: Lint check**

  Run:
  ```bash
  cd frontend && npm run lint
  ```
  Expected: No lint errors in modified files.

- [ ] **Step 3: Visual check (manual)**

  Start dev server:
  ```bash
  cd frontend && npm run dev
  ```

  Navigate to `http://localhost:3000/zh/about/intro` and verify:
  1. Hero subtitle includes "幸福员工，感动客户"
  2. Motto pull-quote displays "有孚盈缶，知恩允能"
  3. 6 value cards display in grid (诚/利/恩/勤/专/责)
  4. Core capabilities section unchanged
  5. R&D strength section unchanged
  6. "选择孚恩的理由" shows 4 pillars with bullet points
  7. CTA section unchanged
  8. English locale (`/en/about/intro`) renders correctly with English text

---

## Spec Coverage Check

| Spec Section | Plan Task | Status |
|-------------|-----------|--------|
| Hero subtitle merges mission | Task 2, Step 1 | Covered |
| 企业概况 + 司训 pull-quote | Task 2, Step 1 | Covered |
| 核心价值观 (6 cards) | Task 2, Step 1 | Covered |
| 核心能力 (unchanged) | Task 2, Step 1 | Covered |
| 研发实力 (unchanged) | Task 2, Step 1 | Covered |
| 选择孚恩的理由 (4 pillars) | Task 2, Step 1 | Covered |
| CTA (unchanged) | Task 2, Step 1 | Covered |
| i18n translation keys | Task 1 | Covered |
| 企业资质 removed | Task 2, Step 1 (omitted from fallback) | Covered |

## Placeholder Scan

- No "TBD", "TODO", or "implement later" found.
- All code blocks contain complete, runnable code.
- All file paths are exact.
- All translation keys referenced in code are defined in messages.
- Type consistency: `Section` type, `parseStrapiContent`, `getFallbackSections` unchanged and reused.

## Type Consistency Check

- `getTranslations({ locale, namespace: 'About' })` returns `t` — used with `t('values.integrity')`, `t.raw('whyChooseUs.strength.points')`, `t('motto')`. All keys defined in zh.json and en.json.
- `t.raw()` returns `unknown` — cast to `string[]` with `as string[]` (already in code via `t.raw(...) as string[]`).
- Component props unchanged: `{ params: Promise<{ locale: string }> }`.
