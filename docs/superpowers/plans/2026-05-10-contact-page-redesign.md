# 联系页面重设计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重设计 `/contact` 联系页面：移除无功能表单，展示完整 5 个办事处网络，添加 i18n 中英文支持。

**Architecture:** 三区块页面结构：Hero（i18n 标题）+ Map+Cards 双栏（OpenStreetMap 嵌入 + 办事处卡片列表）+ CTA（联系方式汇总）。办事处数据硬编码在组件内，通过 `locale` prop 切换中英文。

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Tailwind CSS, next-intl, Heroicons (inline SVG)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `app/[locale]/contact/page.tsx` | 修改 | 页面入口，接收 locale param，渲染 Hero + OfficesSection + CTA |
| `components/sections/OfficesSection.tsx` | **创建** | 地图 + 办事处卡片双栏布局，内含 OFFICES 数据数组 |
| `components/sections/ContactMap.tsx` | **删除** | 旧组件被 OfficesSection 替代 |
| `components/sections/ContactForm.tsx` | **删除** | 无实际功能，用户要求移除 |
| `messages/zh.json` | 修改 | 新增 `ContactPage` 命名空间翻译 |
| `messages/en.json` | 修改 | 新增 `ContactPage` 命名空间翻译 |

---

## Task 1: 新增 i18n 翻译键

**Files:**
- Modify: `messages/zh.json`
- Modify: `messages/en.json`

**目标:** 在 `zh.json` 和 `en.json` 中添加 `ContactPage` 命名空间。

- [ ] **Step 1: 在 `messages/zh.json` 中添加翻译键**

找到文件末尾（最后一个闭合大括号之前），在最后一个顶级键后面添加：

```json
,
  "ContactPage": {
    "title": "联系我们",
    "subtitle": "随时与孚恩团队取得联系，获取产品咨询与技术支持",
    "officesTitle": "办事处",
    "officesSubtitle": "我们在全国各地设有办事处，为您提供本地化的服务支持",
    "mapHint": "点击地图标记查看位置",
    "hqBadge": "总部",
    "address": "地址",
    "phone": "电话",
    "email": "邮箱",
    "fax": "传真",
    "zipCode": "邮编",
    "ctaTitle": "我们期待与您的合作",
    "nationalHotline": "全国统一热线",
    "faxShort": "传真"
  }
```

注意：添加逗号确保 JSON 格式正确。如果不确定插入位置，找到 `"News"` 或 `"Applications"` 等已有命名空间之后。

- [ ] **Step 2: 在 `messages/en.json` 中添加翻译键**

同样在文件末尾添加：

```json
,
  "ContactPage": {
    "title": "Contact Us",
    "subtitle": "Get in touch with the FN Tech team for product inquiries and technical support",
    "officesTitle": "Our Offices",
    "officesSubtitle": "We have offices across China to provide localized service and support",
    "mapHint": "Click markers on the map to view locations",
    "hqBadge": "Headquarters",
    "address": "Address",
    "phone": "Phone",
    "email": "Email",
    "fax": "Fax",
    "zipCode": "Postal Code",
    "ctaTitle": "We Look Forward to Working With You",
    "nationalHotline": "National Hotline",
    "faxShort": "Fax"
  }
```

- [ ] **Step 3: 验证 JSON 格式**

Run:
```bash
cd /c/Users/cheng/Desktop/seo-outsea/frontend
node -e "JSON.parse(require('fs').readFileSync('messages/zh.json')); console.log('zh.json OK')"
node -e "JSON.parse(require('fs').readFileSync('messages/en.json')); console.log('en.json OK')"
```
Expected: 两行 `OK` 输出，无报错。

- [ ] **Step 4: Commit**

```bash
git add messages/zh.json messages/en.json
git commit -m "feat(i18n): add ContactPage translation keys for zh and en"
```

---

## Task 2: 创建 OfficesSection 组件

**Files:**
- Create: `components/sections/OfficesSection.tsx`

**目标:** 新建组件，包含 OpenStreetMap 嵌入地图 + 办事处卡片列表双栏布局。

- [ ] **Step 1: 创建文件并写入完整代码**

`components/sections/OfficesSection.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';

interface OfficeLocation {
  name: string;
  nameEn: string;
  address: string;
  addressEn: string;
  phone: string;
  phone2?: string;
  fax?: string;
  email?: string;
  zipCode?: string;
  lat: number;
  lng: number;
  isHQ?: boolean;
}

const OFFICES: OfficeLocation[] = [
  {
    name: '上海总部',
    nameEn: 'Shanghai Headquarters',
    address: '上海市闵行区新骏环路588弄23幢东4-5层',
    addressEn: '4-5F, Bldg 23, Lane 588 Xinjun Huan Rd, Minhang District, Shanghai',
    phone: '4000-56-5516',
    phone2: '021-5432-6377',
    fax: '021-5432-5266',
    email: 'sales@fn-tech.com',
    zipCode: '201112',
    lat: 31.022,
    lng: 121.395,
    isHQ: true,
  },
  {
    name: '成都办',
    nameEn: 'Chengdu Office',
    address: '成都市武侯区府城大道西段399号7号楼3单元1204室',
    addressEn: 'Rm 1204, Unit 3, Bldg 7, No. 399 W. Fucheng Ave, Wuhou District, Chengdu',
    phone: '4000-56-5516',
    lat: 30.5728,
    lng: 104.0668,
  },
  {
    name: '山东办',
    nameEn: 'Shandong Office',
    address: '济南市高新区会展香格里拉东北塔916号',
    addressEn: 'Rm 916, NE Tower, Shangri-La Exhibition Center, Hi-Tech Zone, Jinan',
    phone: '4000-56-5516',
    lat: 36.6512,
    lng: 117.1201,
  },
  {
    name: '长沙办',
    nameEn: 'Changsha Office',
    address: '湖南省长沙市岳麓区润嘉公园道B栋14楼',
    addressEn: '14F, Bldg B, Runjia Park Avenue, Yuelu District, Changsha',
    phone: '4000-56-5516',
    lat: 28.2280,
    lng: 112.9388,
  },
  {
    name: '武汉办',
    nameEn: 'Wuhan Office',
    address: '武汉市汉阳区蔷薇路泰富城1栋3单元D1212室',
    addressEn: 'Rm D1212, Unit 3, Bldg 1, Taifu City, Qiangwei Rd, Hanyang District, Wuhan',
    phone: '4000-56-5516',
    lat: 30.5928,
    lng: 114.3055,
  },
];

function MapEmbed({ locale }: { locale: string }) {
  // OpenStreetMap embed covering central-eastern China
  const src =
    'https://www.openstreetmap.org/export/embed.html?bbox=103.0%2C28.0%2C122.0%2C37.0&layer=mapnik' +
    '&marker=31.022%2C121.395' +
    '&marker=30.5728%2C104.0668' +
    '&marker=36.6512%2C117.1201' +
    '&marker=28.228%2C112.9388' +
    '&marker=30.5928%2C114.3055';

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      <iframe
        title={locale === 'zh' ? '办事处位置地图' : 'Office Locations Map'}
        src={src}
        className="w-full"
        style={{ height: '400px', border: 'none' }}
        loading="lazy"
      />
    </div>
  );
}

function OfficeCard({ office, locale }: { office: OfficeLocation; locale: string }) {
  const t = useTranslations('ContactPage');
  const isZh = locale === 'zh';

  return (
    <div
      className={`rounded-2xl p-5 ${
        office.isHQ
          ? 'bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200'
          : 'bg-white border border-neutral-200'
      } shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            office.isHQ ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-base text-neutral-900">
            {isZh ? office.name : office.nameEn}
          </h3>
          {office.isHQ && (
            <span className="inline-block text-xs font-medium bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mt-0.5">
              {t('hqBadge')}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-neutral-600">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{isZh ? office.address : office.addressEn}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a href={`tel:${office.phone}`} className="text-primary-600 hover:text-primary-700">
            {office.phone}
          </a>
          {office.phone2 && (
            <>
              <span className="text-neutral-300">|</span>
              <a href={`tel:${office.phone2}`} className="text-primary-600 hover:text-primary-700">
                {office.phone2}
              </a>
            </>
          )}
        </div>

        {office.email && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${office.email}`} className="text-primary-600 hover:text-primary-700">
              {office.email}
            </a>
          </div>
        )}

        {office.fax && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{t('faxShort')}: {office.fax}</span>
          </div>
        )}

        {office.zipCode && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{t('zipCode')}: {office.zipCode}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OfficesSection({ locale }: { locale: string }) {
  const t = useTranslations('ContactPage');

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">{t('officesTitle')}</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">{t('officesSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map - spans 2 cols on desktop */}
          <div className="lg:col-span-2 space-y-3">
            <MapEmbed locale={locale} />
            <p className="text-xs text-neutral-500 text-center">{t('mapHint')}</p>
          </div>

          {/* Office Cards - spans 3 cols on desktop */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-4">
            {OFFICES.map((office, index) => (
              <div
                key={office.name}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <OfficeCard office={office} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 确认文件存在**

Run:
```bash
ls -la components/sections/OfficesSection.tsx
```
Expected: 文件存在，大小 > 4000 bytes。

- [ ] **Step 3: Commit**

```bash
git add components/sections/OfficesSection.tsx
git commit -m "feat(contact): create OfficesSection with map and 5 office cards"
```

---

## Task 3: 修改联系页面 page.tsx

**Files:**
- Modify: `app/[locale]/contact/page.tsx`
- Delete: `components/sections/ContactMap.tsx`
- Delete: `components/sections/ContactForm.tsx`

**目标:** 重写 page.tsx 为 i18n 版本的三区块结构，移除旧组件引用。

- [ ] **Step 1: 重写 page.tsx**

`app/[locale]/contact/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import OfficesSection from '@/components/sections/OfficesSection';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-primary-500/10" />
            <div className="absolute inset-12 rounded-full border border-primary-500/8" />
            <div className="absolute inset-24 rounded-full border border-primary-500/5" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-5">{t('title')}</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Map & Offices */}
      <OfficesSection locale={locale} />

      {/* CTA Section */}
      <section className="py-16 bg-primary-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-6">{t('ctaTitle')}</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href="tel:4000-56-5516"
              className="flex items-center gap-2 text-primary-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-lg font-medium">4000-56-5516</span>
            </a>
            {locale === 'zh' && (
              <span className="hidden sm:inline text-primary-700">|</span>
            )}
            <a
              href="mailto:sales@fn-tech.com"
              className="flex items-center gap-2 text-primary-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-medium">sales@fn-tech.com</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: 删除旧组件文件**

Run:
```bash
git rm components/sections/ContactMap.tsx components/sections/ContactForm.tsx
```
Expected: 两个文件被删除，git 状态显示 `D`。

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/contact/page.tsx components/sections/ContactMap.tsx components/sections/ContactForm.tsx
git commit -m "feat(contact): redesign contact page with i18n, remove form, add 5 offices"
```

---

## Task 4: 构建验证

**Files:**
- 无新文件，验证现有变更

**目标:** 确保 TypeScript 编译通过，页面能正常构建。

- [ ] **Step 1: 运行 TypeScript 检查**

Run:
```bash
cd /c/Users/cheng/Desktop/seo-outsea/frontend
npx tsc --noEmit
```
Expected: 无错误输出（`error TS` 行数为 0）。如果有错误，修复后再继续。

- [ ] **Step 2: 运行 Next.js build**

Run:
```bash
npm run build
```
Expected: Build completed successfully，无 `Failed to compile` 错误。

注意：build 过程中可能会有字体下载警告（Noto Sans timeout），这是已知问题，不影响构建。

- [ ] **Step 3: 浏览器验证**

启动 dev server（如果未运行）：
```bash
npm run dev
```

打开浏览器验证：
- `http://localhost:3000/zh/contact` — 中文页面
- `http://localhost:3000/en/contact` — 英文页面

检查项：
- [ ] 页面显示 Hero 标题"联系我们" / "Contact Us"
- [ ] 显示 5 个办事处卡片（上海 HQ 突出显示）
- [ ] 左侧/上方有 OpenStreetMap 嵌入地图
- [ ] 底部 CTA 显示热线和邮箱
- [ ] 中英文切换时文字正确变化
- [ ] 无联系表单残留
- [ ] 移动端布局正常（卡片堆叠）

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(contact): verify build pass after contact page redesign"
```

---

## 计划自我审查

**1. Spec coverage:**
- [x] 移除联系表单 → Task 3 Step 2（删除 ContactForm.tsx）
- [x] 展示 5 个办事处 → Task 2（OfficesSection 含完整数据）
- [x] 地图 + 卡片双栏 → Task 2（MapEmbed + OfficeCard + grid layout）
- [x] i18n 中英文 → Task 1（翻译键）+ Task 2/3（useTranslations）
- [x] Hero + CTA 三区块 → Task 3（page.tsx 重写）
- [x] 响应式 → Task 2（lg:grid-cols-5 等断点）
- [x] 动画 → Task 2/3（animate-fade-in-up）

**2. Placeholder scan:** 无 TBD/TODO/"implement later"。所有代码块完整。

**3. Type consistency:** 
- `OfficeLocation` 接口在 Task 2 中定义，被 `MapEmbed` 和 `OfficeCard` 使用，一致。
- `locale` prop 类型为 `string`，在 Task 2 和 Task 3 中一致。
- `ContactPageProps` 使用 `params: Promise<...>` 与 Next.js 15 async params 模式一致。

**4. 无 gaps。** 所有 spec 要求均有对应任务。
