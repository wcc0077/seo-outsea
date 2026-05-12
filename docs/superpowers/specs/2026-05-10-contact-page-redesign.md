# 联系页面重设计方案

## 项目
seo-outsea / FN Tech (上海孚恩电子科技有限公司) 官网前端

## 日期
2026-05-10

---

## 背景

当前 `/contact` 页面存在以下问题：
- 办事处数据不完整：仅显示上海总部（地址为旧地址），缺少成都/山东/长沙/武汉办事处
- 联系表单仅有前端样式，无实际提交功能，且用户明确要求**移除表单**
- 页面无 i18n 支持，标题硬编码为英文
- 整体视觉平淡，未充分利用品牌色系

## 目标

1. 展示完整办事处网络（上海总部 + 4 个区域办事处）
2. 移除无功能的联系表单，改用信息展示导向
3. 添加中英文 i18n 支持
4. 提升视觉品质，与品牌调性一致

## 设计

### 页面结构（三区块）

```
┌─────────────────────────────────────────┐
│  Hero Section：标题 + 副标题              │
│  深色渐变背景，居中，底部过渡到白色         │
├─────────────────────────────────────────┤
│  Map + Office Cards 双栏布局              │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ OpenStreet  │  │ 上海总部（HQ）   │   │
│  │ Map         │  │ 成都办           │   │
│  │ (多标记点)   │  │ 山东办           │   │
│  │             │  │ 长沙办           │   │
│  └─────────────┘  │ 武汉办           │   │
│                   └─────────────────┘   │
├─────────────────────────────────────────┤
│  CTA Section：关键联系方式汇总             │
│  全国统一热线 + 邮箱                      │
└─────────────────────────────────────────┘
```

### 1. Hero Section

- **背景**：`bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900`
- **内容**：
  - 标题：`t('ContactPage.title')` → "联系我们" / "Contact Us"
  - 副标题：`t('ContactPage.subtitle')` → "随时与孚恩团队取得联系，获取产品咨询与技术支持" / "Get in touch with FN Tech for product inquiries and technical support"
- **底部过渡**：`bg-gradient-to-t from-white to-transparent`，高度 `h-20`
- **动画**：标题 `animate-fade-in-up`

### 2. Map + Office Cards Section

**左侧：OpenStreetMap 嵌入地图**
- 使用 `<iframe>` 嵌入 OpenStreetMap
- 初始视口居中于中国东部（覆盖所有办事处）
- 每个办事处在地图上通过 marker 标记
- iframe 带 `rounded-xl`、`shadow-lg`、`border`
- 下方小字提示：`t('ContactPage.mapHint')` → "点击地图标记查看位置"

**右侧：办事处卡片列表**
- 容器：`grid grid-cols-1 gap-6`
- **上海总部**（HQ）卡片突出：
  - 更大尺寸
  - `border-2 border-primary-200`
  - `bg-gradient-to-br from-primary-50 to-white`
  - HQ 徽章：青底色 pill badge
- **其他办事处**：标准白色卡片，`border border-neutral-200`
- 每张卡片包含：
  - 城市名（HQ 带徽章）
  - 地址（地图 pin 图标）
  - 电话（电话图标，可点击 `tel:`）
  - 邮箱（仅 HQ，信封图标，可点击 `mailto:`）
  - 传真（仅 HQ）
  - 邮编（仅 HQ）
- 图标使用 Heroicons outline 风格，与现有代码一致

### 3. CTA Section

- **背景**：`bg-primary-950 text-white`
- **内容**：
  - 标题：`t('ContactPage.ctaTitle')` → "我们期待与您的合作" / "We look forward to working with you"
  - 全国统一热线：4000-56-5516（大号，带电话图标）
  - 邮箱：sales@fn-tech.com（带信封图标）
  - 可选：传真 021-5432-5266（仅中文页显示）
- **动画**：`animate-fade-in-up`

### 办事处数据

```typescript
const OFFICES = [
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
```

### i18n 翻译键

新增到 `messages/zh.json` 和 `messages/en.json`：

```json
{
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
}
```

英文版本对应翻译。

### 响应式

- **Desktop (>= 1024px)**：地图 + 卡片双栏（地图占 5/12，卡片占 7/12）
- **Tablet (768-1023px)**：地图全宽在上，卡片双列在下
- **Mobile (< 768px)**：单列堆叠，地图在上，卡片垂直排列

### 动画

- Hero 标题：`animate-fade-in-up`
- 办事处卡片：交错入场 `animate-fade-in-up`，延迟 100ms 递增
- CTA 区块：`animate-fade-in-up`

## 技术方案

### 文件变更

| 文件 | 操作 | 说明 |
|------|------|------|
| `app/[locale]/contact/page.tsx` | 修改 | 移除 ContactForm，使用新 OfficesSection，调整 Hero 为 i18n 版本 |
| `components/sections/ContactMap.tsx` | 重命名/修改 | 改名为 `OfficesSection.tsx`，重写为地图 + 卡片双栏 |
| `components/sections/ContactForm.tsx` | 删除 | 无实际功能，用户要求移除 |
| `messages/zh.json` | 修改 | 新增 `ContactPage` 命名空间 |
| `messages/en.json` | 修改 | 新增 `ContactPage` 命名空间 |

### 组件设计

**`OfficesSection`**（server component，无交互）：
- 接收 `locale: string` prop，用于切换中英文
- 内部定义 `OFFICES` 数据数组
- 渲染地图 iframe + 办事处卡片 grid
- 使用 `useTranslations` 获取翻译

### 依赖

- 无需新增依赖
- 使用现有：Tailwind CSS、`next-intl`、Heroicons（SVG inline）

## 边界情况

- 地图 iframe 加载失败：保留卡片列表作为主要信息来源
- 移动端地图尺寸：使用 `aspect-video` 或固定高度确保可用
- 中英文地址切换：HQ 显示完整地址（含邮编），其他办事处显示简洁地址

## 成功标准

- [ ] 页面展示全部 5 个办事处（上海 HQ + 4 个区域办）
- [ ] 中英文切换时标题、副标题、卡片文字正确变化
- [ ] 联系表单已完全移除
- [ ] 页面在桌面/平板/移动端均正常显示
- [ ] 无 build 错误、无 console 报错
