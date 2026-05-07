import { factories } from '@strapi/strapi';

const FAQ_ARTICLES = [
  {
    title: 'RFID读写距离有多远？哪些因素会影响读取范围？',
    slug: 'rfid-read-distance',
    category: 'faq',
    content: `## RFID读写距离

RFID的读取距离因频率和功率不同而有很大差异：

### 各频段典型读取距离

- **HF/NFC（13.56MHz）**：通常 0-10cm，适合近距离安全应用
- **UHF超高频（860-960MHz）**：通常 0-10m，适合物流、仓储等远距离场景
- **LF低频（125KHz）**：通常 0-5cm，适合动物识别、门禁

### 影响读取距离的关键因素

1. **读写器发射功率**：功率越大，读取距离越远
2. **天线增益**：高增益天线可显著提升读取距离
3. **标签尺寸和设计**：更大的标签天线面积 = 更好的信号接收
4. **环境干扰**：金属、液体等会显著影响RFID信号
5. **金属影响**：金属会反射RFID信号，需使用抗金属标签`,
    tags: ['读取距离', '读取范围', '影响因素', 'UHF', 'HF'],
    publishDate: '2025-01-15',
    author: 'FN Tech',
    order: 1,
    seoTitle: 'RFID读写距离有多远？影响因素详解 | FN Tech',
    seoDescription: '了解RFID读写距离的影响因素，包括HF/NFC、UHF各频段的典型读取范围，以及功率、天线、环境等关键因素。',
  },
  {
    title: 'RFID的工作频率有哪些？低频、高频、超高频各有什么特点？',
    slug: 'rfid-frequency-bands',
    category: 'technical',
    content: `## RFID工作频率详解

RFID技术使用多个不同的工作频率，每个频段有其独特的优势和适用场景。

### LF低频（125KHz - 134.2KHz）

- **特点**：穿透力强，可穿透水和有机物
- **读取距离**：0-5cm
- **典型应用**：动物识别、门禁系统、汽车防盗
- **优势**：对金属和液体环境适应性好

### HF高频（13.56MHz）

- **特点**：NFC兼容，数据传输速率较高
- **读取距离**：0-10cm（部分可达1m）
- **典型应用**：智能卡、支付系统、图书管理、票务
- **优势**：全球标准统一，NFC生态成熟

### UHF超高频（860MHz - 960MHz）

- **特点**：读取距离远，可批量读取
- **读取距离**：0-10m（视功率和天线而定）
- **典型应用**：物流仓储、零售管理、资产追踪、生产制造
- **优势**：标签成本低，读取速度快，适合大规模部署

### 如何选择合适频段？

- 需要**远距离批量读取** → UHF
- 需要**安全近距离交互** → HF/NFC
- 需要**穿透液体/生物组织** → LF`,
    tags: ['RFID频率', '低频', '高频', '超高频', 'LF', 'HF', 'UHF'],
    publishDate: '2025-01-20',
    author: 'FN Tech',
    order: 2,
    seoTitle: 'RFID工作频率详解：低频、高频、超高频对比 | FN Tech',
    seoDescription: '全面了解RFID各工作频段的特点和适用场景，帮助您选择合适的RFID频率方案。',
  },
  {
    title: 'RFID标签可以重复读写吗？读写次数是多少？',
    slug: 'rfid-tag-rewritable',
    category: 'faq',
    content: `## RFID标签读写能力

### 可读写标签

大多数RFID标签芯片内置EEPROM存储器，支持重复读写操作：

- **EEPROM读写次数**：通常10万次以上
- **数据保持时间**：10-50年（取决于芯片和环境）
- **写入速度**：毫秒级

### 标签类型

- **只读标签（Read-Only）**：出厂时已写入唯一ID，不可修改
- **一次写入多次读取（WORM）**：可写入一次，之后只读
- **可读写标签（Read/Write）**：支持重复读写，最灵活

### 应用场景建议

- **资产追踪**：使用可读写标签，可更新资产状态信息
- **产品防伪**：使用只读或WORM标签，防止篡改
- **物流管理**：使用可读写标签，记录运输状态

### 注意事项

频繁写入会缩短标签寿命，建议仅在必要时更新数据，日常操作以读取为主。`,
    tags: ['RFID标签', '重复读写', '读写次数', 'EEPROM'],
    publishDate: '2025-02-01',
    author: 'FN Tech',
    order: 3,
    seoTitle: 'RFID标签可以重复读写吗？读写次数详解 | FN Tech',
    seoDescription: '了解RFID标签的读写能力、EEPROM读写次数限制以及不同标签类型的适用场景。',
  },
  {
    title: '主动式RFID与被动式RFID有何区别？如何选择？',
    slug: 'active-vs-passive-rfid',
    category: 'guide',
    content: `## 主动式 vs 被动式RFID

### 被动式RFID（无源）

- **供电方式**：靠读写器发射的射频信号供电
- **读取距离**：几厘米到十几米（UHF）
- **成本**：标签成本低（几毛到几元）
- **寿命**：几乎无限（无电池）
- **尺寸**：小巧灵活
- **典型应用**：物流仓储、零售管理、门禁、资产标签

### 主动式RFID（有源）

- **供电方式**：标签内置电池
- **读取距离**：几十米到上百米
- **成本**：标签成本高（几十到几百元）
- **寿命**：受电池限制（通常3-5年）
- **尺寸**：较大
- **典型应用**：车辆管理、集装箱追踪、人员定位

### 选择指南

| 需求 | 推荐方案 |
|------|----------|
| 大批量物品追踪 | 被动式UHF |
| 远距离实时监控 | 主动式 |
| 成本控制优先 | 被动式 |
| 超长读取距离 | 主动式 |
| 长寿命免维护 | 被动式 |
| 恶劣环境使用 | 主动式（工业级外壳） |

### FN Tech产品覆盖

我们提供被动式和主动式全系列RFID产品，可根据您的具体应用场景推荐最合适的方案。`,
    tags: ['主动式RFID', '被动式RFID', '有源标签', '无源标签'],
    publishDate: '2025-02-10',
    author: 'FN Tech',
    order: 4,
    seoTitle: '主动式与被动式RFID区别及选型指南 | FN Tech',
    seoDescription: '对比主动式和被动式RFID的优缺点，帮助您在不同应用场景中选择最合适的RFID方案。',
  },
  {
    title: 'RFID在光伏行业的应用',
    slug: 'rfid-photovoltaic-industry',
    category: 'application',
    content: `## RFID在光伏行业的应用

RFID技术在光伏行业的全产业链中发挥着重要的追溯和管理作用。

### 应用场景

#### 1. 硅片生产追溯

- 耐高温RFID载码体安装在硅片载具上
- 记录每批次硅片的生产参数、质量数据
- 实现从原材料到成品的全程追溯

#### 2. 电池片生产管控

- 在切片、清洗、扩散、镀膜等工序追踪载具
- 自动记录各工序的加工时间和参数
- 提高生产效率和良品率

#### 3. 组件全生命周期管理

- 每块光伏组件嵌入RFID标签
- 存储组件的规格、生产日期、质检报告
- 运维阶段快速读取组件信息，便于维护

### 技术挑战与解决方案

- **高温环境**：使用耐高温RFID载码体（可承受200°C以上）
- **金属干扰**：使用特殊设计的抗金属标签
- **户外环境**：使用防水防紫外线的封装标签

### 行业价值

RFID技术帮助光伏企业实现：
- 生产过程自动化管控
- 质量问题快速追溯定位
- 资产运维效率提升
- 全生命周期数据管理`,
    tags: ['RFID', '光伏', '太阳能', '追溯', '耐高温'],
    publishDate: '2025-02-20',
    author: 'FN Tech',
    order: 5,
    seoTitle: 'RFID在光伏行业的应用场景 | FN Tech',
    seoDescription: '了解RFID技术在光伏硅片、电池片、组件等全产业链中的应用，以及耐高温载码体的解决方案。',
  },
  {
    title: '什么是RFID？一文读懂射频识别技术的基本原理',
    slug: 'what-is-rfid',
    category: 'technical',
    content: `## 什么是RFID？

RFID（Radio Frequency Identification，射频识别）是一种利用无线电波进行非接触式自动识别的技术。

### 工作原理

RFID系统通过以下步骤完成数据识别：

1. **读写器发送射频信号**：读写器通过天线发射特定频率的电磁波
2. **标签被激活**：被动式标签接收到信号后，利用感应电流获得能量被激活
3. **标签返回数据**：标签将存储的编码信息通过天线发送回读写器
4. **读写器解码**：读写器接收并解码信号，将数据传给软件系统

### 系统组成

| 组件 | 功能 |
|------|------|
| 读写器（Reader） | 发送射频信号，接收并解码标签数据 |
| 天线（Antenna） | 射频信号传输媒介 |
| 标签（Tag） | 存储数据的RFID芯片+天线组合 |
| 软件系统 | 数据处理、管理、分析和业务集成 |

### RFID vs 条码

| 特性 | RFID | 条码 |
|------|------|------|
| 读取方式 | 非接触，无需视线 | 需要对准扫描 |
| 读取距离 | 厘米到米级 | 几厘米 |
| 批量读取 | 支持 | 不支持 |
| 数据存储 | 可读写 | 只读 |
| 环境适应性 | 强（可穿透） | 弱（需清晰可见） |
| 成本 | 较高 | 极低 |

### 应用领域

RFID已广泛应用于物流仓储、生产制造、零售管理、资产管理、医疗行业、智慧城市等多个领域。`,
    tags: ['RFID原理', '射频识别', '无线射频', '基础知识'],
    publishDate: '2025-03-01',
    author: 'FN Tech',
    order: 6,
    seoTitle: '什么是RFID？射频识别技术基本原理详解 | FN Tech',
    seoDescription: '一文读懂RFID射频识别技术的工作原理、系统组成、与条码技术的对比，以及主要应用领域。',
  },
  {
    title: 'RFID系统由哪几部分组成？各部件功能详解',
    slug: 'rfid-system-components',
    category: 'technical',
    content: `## RFID系统组成详解

一个完整的RFID系统由四个核心部分组成：

### 1. 读写器（Reader/Interrogator）

读写器是RFID系统的核心设备，负责与标签进行通信。

**主要功能**：
- 发射射频信号激活标签
- 接收标签返回的数据
- 解码并将数据传输给上位机

**类型**：
- **固定式读写器**：安装在固定位置，适合产线、门禁
- **手持式读写器**：便携式，适合巡检、盘点
- **模块型读写器**：嵌入到其他设备中

### 2. 天线（Antenna）

天线是读写器与标签之间射频信号传输的媒介。

**关键参数**：
- 增益（dBi）：决定信号覆盖范围
- 极化方式：线性极化/圆极化
- 方向性：定向/全向

### 3. 标签（Tag/Transponder）

标签是附着在物品上的数据载体。

**组成部分**：
- 芯片：存储数据（通常64bit~8Kbit）
- 天线：接收和发送射频信号
- 基材：PCB、PET、陶瓷等

### 4. 软件系统

软件系统负责处理、管理和分析RFID数据。

**功能层次**：
- **中间件**：过滤、聚合原始RFID数据
- **业务系统**：与ERP、WMS、MES等系统集成
- **数据分析**：趋势分析、报表生成、异常告警

### 系统集成要点

- 选择匹配的读写器和标签频率
- 合理布置天线位置和角度
- 软件系统需处理标签冲突和去重
- 考虑环境因素（金属、液体）的影响`,
    tags: ['RFID系统组成', 'RFID部件', '读写器', '天线', '标签'],
    publishDate: '2025-03-10',
    author: 'FN Tech',
    order: 7,
    seoTitle: 'RFID系统组成部分及各部件功能详解 | FN Tech',
    seoDescription: '详细了解RFID系统的四大组成部分：读写器、天线、标签和软件系统的功能与选型要点。',
  },
];

export default factories.createCoreController('api::faq-article.faq-article', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::faq-article.faq-article').findOne({
      where: { slug, locale: locale || 'en' },
    });

    if (!entity) {
      return ctx.notFound('FAQ article not found');
    }

    return { data: entity };
  },

  async getPublished(ctx) {
    const { locale, category } = ctx.query;
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 20;

    const where: Record<string, unknown> = {
      locale: locale || 'en',
    };

    if (category) {
      where.category = category;
    }

    const { results, pagination } = await strapi.db.query('api::faq-article.faq-article').findPage({
      where,
      orderBy: { order: 'asc', publishDate: 'desc' },
      page,
      pageSize,
    });

    return { data: results, meta: { pagination } };
  },

  async importArticles(ctx) {
    try {
      const existing = await strapi.db.query('api::faq-article.faq-article').findMany({});

      if (existing.length > 0) {
        return {
          success: false,
          message: `Already imported ${existing.length} articles, skipping.`,
        };
      }

      const imported = [];

      for (const article of FAQ_ARTICLES) {
        const baseData = {
          ...article,
          category: article.category as 'faq' | 'technical' | 'application' | 'guide',
          publishedAt: new Date().toISOString(),
        };

        // Create English version
        await strapi.db.query('api::faq-article.faq-article').create({
          data: { ...baseData, locale: 'en' },
        });

        // Create Chinese version
        await strapi.db.query('api::faq-article.faq-article').create({
          data: { ...baseData, locale: 'zh' },
        });

        imported.push(article.title);
      }

      return {
        success: true,
        message: `Imported ${imported.length} FAQ articles (en + zh = ${imported.length * 2} total).`,
        articles: imported,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        message: `Import failed: ${message}`,
      };
    }
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::faq-article.faq-article').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['faq-article'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::faq-article.faq-article').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::faq-article.faq-article').create({
          data: {
            title: item.title as string,
            content: item.content as string,
            author: item.author as string,
            slug: sourceRecord.slug,
            category: sourceRecord.category,
            tags: sourceRecord.tags,
            order: sourceRecord.order,
            publishDate: sourceRecord.publishDate,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate article id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'faq-article',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
