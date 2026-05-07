# fn-tech.com 多语言现代化重构 — 设计文档

**日期：** 2026-05-07  
**状态：** 设计确认

---

## 1. 项目概述

上海孚恩电子科技有限公司（RFID 硬件产品公司）现有网站（fn-tech.com）为传统静态企业站，设计老旧、无 SEO 优化、无内容管理系统、无多语言支持。本项目旨在重构为一个现代化的多语言企业官网。

### 1.1 目标

- **SEO 优先：** 服务端渲染（SSR），爬虫直接获取完整 HTML
- **多语言可配置：** 运营人员可在后台添加/启用/禁用语言，前端自动适配
- **内容管理：** 非技术人员通过 CMS 后台管理全部内容（产品、新闻、页面等）
- **现代化设计：** 科技蓝简洁风，响应式，微动画
- **前后端分离：** 前端与 CMS 独立部署、独立扩展

### 1.2 约束

- 数据量不大，SQLite 足够（后续可迁移 PostgreSQL）
- **目标用户主要在海外**，前端部署 Vercel（全球 CDN），后端部署海外 VPS
- **默认语言为英文（en）**，中文（zh）为次要语言，后续可灵活添加
- 全部内容（产品、新闻、页面、应用）都需要多语言支持

---

## 2. 技术栈

### 2.1 前端

| 技术 | 用途 | 说明 |
|------|------|------|
| **Next.js 15** | 应用框架 | App Router + React Server Components + SSR |
| **next-intl** | 多语言路由 | URL 前缀方案 `/[locale]/...`，语言列表从 API 动态获取 |
| **Tailwind CSS** | 样式 | 实用类 CSS 框架，配合自定义设计系统 |
| **React** | UI 组件 | 客户端水合后的交互逻辑 |

### 2.2 后端 / CMS

| 技术 | 用途 | 说明 |
|------|------|------|
| **Strapi** | Headless CMS | REST API + 管理后台 + i18n 插件 + Dynamic Zones |
| **SQLite** | 数据库 | 嵌入式数据库，单文件，零配置 |

### 2.3 部署

| 组件 | 平台 | 说明 |
|------|------|------|
| **前端** | Vercel | 全球 CDN，海外访问最优 |
| **Strapi + DB** | 海外 VPS（DigitalOcean/Linode/AWS） | Docker 容器化部署 |
| **域名** | fn-tech.com | 开发阶段用 Vercel 临时域名，上线时切换 DNS |

---

## 3. 系统架构

```
┌─────────────────────┐   HTTPS REST API    ┌──────────────────────┐
│   Next.js 前端       │◄──────────────────►│   Strapi CMS          │
│   Vercel 部署         │                     │   海外 VPS              │
│                     │                     │                      │
│  • SSR (SEO)        │                     │  • SQLite (.db)       │
│  • next-intl        │                     │  • i18n 插件          │
│  • Tailwind CSS     │                     │  • Dynamic Zones      │
│  • Sitemap          │                     │  • Draft/Publish      │
│  • OG Image         │                     │  • 角色权限           │
└─────────────────────┘                     └──────────────────────┘
```

**数据流：**
1. 运营在 Strapi 后台编辑多语言内容，发布
2. Next.js 通过 Strapi API 拉取内容，服务端渲染完整 HTML
3. 用户/搜索引擎爬虫访问 Next.js 获取完整 HTML
4. 客户端水合后变成交互式 React 应用

---

## 4. 内容模型（Strapi Content Types）

所有类型均开启 Strapi i18n 插件，支持多语言。

### 4.1 Global（全局配置）

单例（Single Type），管理网站全局设置。

| 字段 | 类型 | 说明 |
|------|------|------|
| `siteName` | Text | 网站名称 |
| `logo` | Media | Logo 图片 |
| `contactInfo` | Component | 地址、电话、邮箱 |
| `socialLinks` | Component（可重复） | 微信公众号二维码等 |
| `languages` | JSON | 启用的语言列表 `[{code: "zh", name: "中文", enabled: true}, ...]` |
| `defaultLocale` | Text | 默认语言（"en"） |

### 4.2 Page（页面）

集合类型（Collection Type），管理普通页面。

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | UID | URL 路径标识（如 "about"） |
| `title` | Text | 页面标题 |
| `heroBanner` | Component | Hero 区域（标题、副标题、背景图、CTA 按钮） |
| `sections` | **Dynamic Zone** | 自由组合内容区块（见 4.6） |
| `seoTitle` | Text | SEO 标题 |
| `seoDescription` | Text | SEO 描述 |
| `seoKeywords` | Text | SEO 关键词 |

### 4.3 ProductCategory（产品分类）

集合类型，产品的分类层级。

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | Text | 分类名称（如 "RFID 读写器"） |
| `slug` | UID | URL 标识 |
| `description` | Rich Text | 分类描述 |
| `parent` | Relation → ProductCategory | 父分类（支持多级分类） |
| `sortOrder` | Integer | 排序权重 |
| `image` | Media | 分类封面图 |

### 4.4 Product（产品）

集合类型，具体产品信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | Text | 产品名称 |
| `slug` | UID | URL 标识 |
| `description` | Rich Text | 产品描述 |
| `specs` | Component（可重复） | 技术参数（名称、值） |
| `images` | Media（多图） | 产品图片 |
| `category` | Relation → ProductCategory | 所属分类 |
| `seoTitle` / `seoDescription` / `seoKeywords` | Text | SEO 字段 |

### 4.5 Application（行业应用）

集合类型，行业解决方案。

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | Text | 应用名称（如 "智能制造"） |
| `slug` | UID | URL 标识 |
| `description` | Rich Text | 应用描述 |
| `images` | Media | 应用场景图片 |
| `useCase` | Rich Text | 使用案例详情 |
| `seoTitle` / `seoDescription` / `seoKeywords` | Text | SEO 字段 |

### 4.6 News（新闻）

集合类型，公司新闻动态。

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | Text | 新闻标题 |
| `slug` | UID | URL 标识 |
| `content` | Rich Text | 新闻正文 |
| `coverImage` | Media | 封面图 |
| `publishDate` | Date | 发布日期 |
| `author` | Text | 作者 |
| `seoTitle` / `seoDescription` | Text | SEO 字段 |

### 4.7 Dynamic Zone 组件库

Page 的 `sections` 字段使用 Dynamic Zone，预定义以下组件：

| 组件 | 用途 |
|------|------|
| `HeroSection` | 大图 Banner（标题、副标题、背景图、CTA） |
| `ProductGrid` | 产品网格（选择分类，展示产品卡片） |
| `ApplicationShowcase` | 行业应用展示（选择应用，展示图文） |
| `NewsList` | 新闻列表（数量、筛选） |
| `TextImage` | 图文混排（左图右文或反之） |
| `StatsSection` | 数据展示（数字 + 标签） |
| `FAQSection` | 常见问题（问答列表） |
| `ContactForm` | 联系表单区块 |
| `Spacer` | 空白间隔 |

---

## 5. 前端路由结构

基于 next-intl 的 `[locale]` 动态路由：

```
/[locale]/                              首页（使用 Dynamic Zones 渲染）
/[locale]/about                         关于孚恩（Page: slug="about"）
/[locale]/products                      产品列表（按分类展示）
/[locale]/products/[category]           分类页（ProductCategory slug）
/[locale]/products/[category]/[slug]    产品详情
/[locale]/applications                  行业应用列表
/[locale]/applications/[slug]           行业应用详情
/[locale]/news                          新闻列表（分页）
/[locale]/news/[slug]                   新闻详情
/[locale]/support                       技术支持（Page: slug="support"）
/[locale]/contact                       联系我们（Page: slug="contact"）
/[locale]/sharing                       知识分享（Page: slug="sharing"）
```

### 5.1 语言切换逻辑

- 导航栏放置语言切换器（下拉或按钮组）
- 切换时保持当前页面路径：`/en/products` → `/zh/products`
- 首次访问：根据浏览器语言自动选择最匹配的 locale，不支持则 fallback 到英文（en）
- 语言列表从 Strapi `/api/global` 的 `languages` 字段动态读取

---

## 6. 多语言实现细节

### 6.1 URL 方案

路径前缀方案（SEO 最佳实践）：
```
/fn-tech.com/en/about    → 英文版（默认）
/fn-tech.com/zh/about    → 中文版
/fn-tech.com/ja/about    → 日文版
```

### 6.2 Strapi i18n 集成

- Strapi 开启 i18n 插件
- 所有 Collection Types 自动获得 `locale` 字段
- API 请求时传 `locale=zh` 参数获取对应语言内容
- next-intl 的 `getTranslations()` 与 Strapi 内容独立：
  - Strapi i18n 管理**业务内容**（产品、新闻等）
  - next-intl 管理**UI 文案**（按钮文字、导航标签、表单占位符等）

### 6.3 动态语言配置

```
前端启动时：
  1. 请求 GET /api/global
  2. 解析 languages[] 字段
  3. 过滤 enabled=true 的语言
  4. 配置 next-intl 的 locales 和 defaultLocale
```

新增语言流程：
1. Strapi 后台 Global 中添加语言条目
2. 前端下次部署自动生效（或配置 ISR 定时刷新）

---

## 7. SEO 设计

### 7.1 服务端渲染

- Next.js App Router 默认 SSR
- 每个页面返回完整 HTML，爬虫直接获取内容
- `<head>` 动态生成：`<title>`, `<meta description>`, `<meta keywords>`

### 7.2 结构化数据（JSON-LD）

- `Organization`：公司信息、联系方式
- `Product`：产品名称、描述、图片
- `BreadcrumbList`：面包屑导航
- `NewsArticle`：新闻文章

### 7.3 Sitemap

- `/sitemap.xml` 动态生成
- 按语言分组：`/zh/sitemap.xml`, `/en/sitemap.xml`
- 包含所有页面 URL、产品 URL、新闻 URL
- `<lastmod>` 字段根据内容更新时间自动设置

### 7.4 Open Graph

- 页面级别 OG 标签（`og:title`, `og:description`, `og:image`, `og:url`）
- `/api/og/[locale]` 路由动态生成 OG 图片
- 社交分享时显示正确的预览

### 7.5 Canonical URL

- 每个页面设置 `rel="canonical"` 指向自身语言版本
- `hreflang` 标签标注各语言等价页面

### 7.6 性能优化

- Next.js Image 组件（自动 WebP 转换、懒加载）
- 代码分割（按路由自动）
- 字体优化（`next/font`，无 FOUC）
- Strapi 响应缓存（Cache-Control headers）

---

## 8. 部署架构

```
┌──────────────────────────────────────────────────────────┐
│                      用户/爬虫                              │
│                                                          │
│   ┌─────────────────┐        ┌──────────────────────┐   │
│   │     Vercel      │        │   海外 VPS          │   │
│   │                 │        │                       │   │
│   │  • 全球 CDN    │        │  ────────────────┐  │   │
│   │    Next.js 前端 │◄──────►│  │   Strapi API    │  │   │
│   │                 │ HTTPS  │  │   (端口 1337)    │  │   │
│   ─────────────────┘        │  └────────┬────────┘  │   │
│                              │           │            │   │
│                              │  ┌────────────────┐  │   │
│                              │  │   SQLite (.db)  │  │   │
│                              │  └─────────────────┘  │   │
│                              └──────────────────────┘   │
│                                                          │
│   域名: fn-tech.com ──► Vercel ─► 解析到 Vercel       │
│   API 域名: api.fn-tech.com ─► 直连海外 VPS                 │
└──────────────────────────────────────────────────────────┘
```

### 8.1 前端（Vercel）

- GitHub 仓库自动触发部署
- 环境变量配置 `NEXT_PUBLIC_STRAPI_URL` 指向后端 API
- ISR（增量静态再生）支持内容更新后自动刷新
- 开发阶段通过 `*.vercel.app` 临时域名访问，不影响旧站

### 8.2 后端（海外 VPS）

- Docker Compose 部署（Strapi + SQLite 持久化卷）
- Nginx 反向代理（HTTPS、CORS 配置、API 缓存）
- PM2 或 Docker 进程管理
- 每日自动备份 `.db` 文件

### 8.3 域名与 SSL

- Vercel 管理前端 DNS 和 SSL 证书
- 前端域名：`fn-tech.com`（上线时 DNS 切换到 Vercel）
- API 子域名：`api.fn-tech.com`（指向海外 VPS）
- 开发阶段：前端用 Vercel 临时域名，旧站不受影响

---

## 9. 项目目录结构

```
seo-outsea/
├── frontend/                 # Next.js 前端
│   ├── app/
│   │   ├── [locale]/         # 多语言路由
│   │   │   ├── layout.tsx    # 根布局（导航、footer、i18n provider）
│   │   │   ├── page.tsx      # 首页
│   │   │   ├── about/        # 关于页面
│   │   │   ├── products/     # 产品列表/分类/详情
│   │   │   ├── applications/ # 行业应用
│   │   │   ├── news/         # 新闻
│   │   │   ├── support/      # 技术支持
│   │   │   ├── contact/      # 联系我们
│   │   │   └── sharing/      # 知识分享
│   │   ├── api/              # API Routes（OG 图片、sitemap）
│   │   └── not-found.tsx     # 404 页面
│   ├── components/           # 可复用组件
│   │   ├── layout/           # Header, Footer, Navbar, LanguageSwitcher
│   │   ├── sections/         # Dynamic Zone 组件（HeroSection, ProductGrid 等）
│   │   ├── ui/               # 基础 UI 组件（Button, Card, Badge 等）
│   │   ── seo/              # SEO 组件（MetaTags, JsonLd, Sitemap）
│   ├── lib/
│   │   ├── strapi.ts         # Strapi API 客户端
│   │   └── i18n.ts           # next-intl 配置
│   ├── messages/             # UI 文案翻译文件（JSON）
│   ├── tailwind.config.ts
│   ├── middleware.ts         # 语言路由中间件
│   └── next.config.ts
│
├── backend/                  # Strapi CMS
│   ├── src/
│   │   ├── api/              # 内容类型定义（Global, Page, Product 等）
│   │   ├── components/       # Dynamic Zone 组件定义
│   │   └── extensions/       # 插件扩展
│   ├── config/
│   ├── database.sqlite       # SQLite 数据库文件（gitignore）
│   └── package.json
│
└── docs/
    └── superpowers/specs/    # 设计文档
```
