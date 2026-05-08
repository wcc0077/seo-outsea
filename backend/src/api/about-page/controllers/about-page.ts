import https from 'https';
import http from 'http';
import { Readable } from 'stream';

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location!).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const ABOUT_PAGES = [
  {
    title: '上海孚恩电子科技有限公司',
    slug: 'company-intro',
    pageType: 'intro' as const,
    sortOrder: 1,
    content: `# 关于上海孚恩电子科技有限公司

## 企业概况

上海孚恩电子科技有限公司成立于2006年，注册资金2002万元，是国内最早专业从事RFID与物联网技术研发的企业之一。公司坐落于上海市闵行区漕河泾浦江高科技园国家863软件孵化器基地，拥有3000多平方米的研发与生产基地。

孚恩电子专注于RFID自动识别、自动数据采集和物联网领域的软硬件研发、生产和销售，主要产品涵盖各频段RFID读写设备（固定式和手持式）、RFID手持机、智能终端、RFID电子芯片、蓝牙RFID扫描器等工业识别产品与解决方案。

## 核心能力

- **RFID 读写设备**：HF/UHF 全频段读写器，支持 IO-Link、ModbusTCP、以太网等工业协议
- **天线与模块**：高性能 RFID 天线设计，满足不同场景的读取需求
- **手持终端**：工业级安卓手持终端，支持条码/RFID 双模识别
- **软件中间件**：RFID 数据管理平台，提供完整的行业应用解决方案

## 研发实力

公司拥有一支高素质的研发团队，核心成员在RFID行业拥有超过15年的技术积累。研发团队60%以上具有硕士学历，具备从芯片选型、电路设计、固件开发、天线设计到应用软件的全栈研发能力。

公司拥有完善的RFID测试环境和生产线，确保产品从设计到量产的每一个环节都经过严格的品质控制。

## 企业资质

- 上海市高新技术企业
- 专精特新中小企业
- 上海市科技小巨人培育企业
- 上海市双软认证企业
- 通过 ISO9001、ISO14001、CCC 等多项认证
- 拥有70余项知识产权`,
    imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/bitbug_favicon.ico',
  },
  {
    title: '公司实景',
    slug: 'company-scenery',
    pageType: 'gallery' as const,
    sortOrder: 2,
    content: `# 公司实景

## 基地概览

公司坐落于上海市闵行区漕河泾浦江高科技园，拥有3000多平方米的研发与生产基地。

- **研发办公区**：坐落于漕河泾浦江高科技园国家863软件孵化器基地，拥有独立的研发办公区域
- **研发中心**：配备专业的RFID测试实验室、电磁兼容测试室和可靠性验证设备
- **生产车间**：标准化SMT贴片线、组装线和老化测试区，确保产品品质
- **产品展示厅**：全方位展示公司RFID产品线和行业解决方案
- **仓储物流中心**：完善的仓储管理和物流配送体系，保障全球客户的供货需求
- **员工活动中心**：为员工提供舒适的休息和娱乐空间，营造积极向上的企业文化`,
    imageUrl: '',
  },
  {
    title: '发展历程',
    slug: 'company-history',
    pageType: 'history' as const,
    sortOrder: 3,
    content: `# 发展历程

## 2006年 — 公司成立
在国家提倡"增强自主创新能力"的大背景下，上海孚恩电子科技有限公司在上海闵行区国家863软件孵化器基地正式注册成立，成为国内最早从事RFID技术研发的企业之一。

## 2008年 — 首款RFID读写器问世
成功研发出第一款工业级RFID读写器，标志着公司在RFID硬件领域取得突破。

## 2010年 — 双软认证
获得"上海市双软认证企业"认定，软件开发能力得到官方认可。

## 2012年 — 高新技术企业认定
被认定为"上海市高新技术企业"，研发实力和技术创新能力获得权威认可。

## 2014年 — 手持终端产品线拓展
推出工业级手持终端系列，实现从固定式读写器到移动终端的产品线扩展。

## 2016年 — 知识产权突破
累计获得30余项知识产权，涵盖RFID天线设计、读写器核心算法等领域。

## 2018年 — 科技小巨人培育企业
被评为"上海市科技小巨人培育企业"，创新能力和发展潜力获得认可。

## 2020年 — UHF产品线全面升级
推出新一代超高频RFID读写器系列产品，性能达到国际先进水平。

## 2022年 — 专精特新中小企业
获评"专精特新中小企业"，在细分领域的专业能力和市场地位得到认可。

## 2024年 — 全球化布局加速
产品线覆盖HF/UHF全频段，应用于智能制造、物流、档案、零售等多个行业，服务全球客户。`,
    imageUrl: '',
  },
  {
    title: '荣誉资质',
    slug: 'company-honors',
    pageType: 'honors' as const,
    sortOrder: 4,
    content: `# 荣誉资质

## 企业资质

- **上海市高新技术企业**：经上海市科学技术委员会、财政局、国家税务局和地方税务局联合认定，具备持续研发创新能力和核心技术
- **专精特新中小企业**：在RFID细分领域具备专业化、精细化、特色化、新颖化发展特征，获得市级专精特新认定
- **上海市科技小巨人培育企业**：具备较强科技创新能力和发展潜力
- **上海市双软认证企业**：软件产品和软件企业双重认证，软件开发能力和产品质量获得官方认可

## 体系认证

- **ISO9001 质量管理体系**：建立标准化的质量管理流程，确保产品品质稳定可靠
- **ISO14001 环境管理体系**：践行绿色环保理念，实现可持续发展
- **CCC 强制认证**：产品通过中国强制性产品认证，符合国家电气安全和电磁兼容标准

## 知识产权

- 累计获得70余项专利和软件著作权，涵盖RFID天线设计、读写器核心算法、中间件平台等关键技术领域`,
    imageUrl: '',
  },
];

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::about-page.about-page', ({ strapi }) => ({
  async import(ctx) {
    const existingCount = await strapi.db.query('api::about-page.about-page').count();
    if (existingCount > 0) {
      return { data: null, error: `About pages already exist (${existingCount}). Skipping import.` };
    }

    const results: { created: number; failed: number; errors: string[] } = { created: 0, failed: 0, errors: [] };

    for (const page of ABOUT_PAGES) {
      try {
        await strapi.documents('api::about-page.about-page').create({
          data: {
            title: page.title,
            slug: page.slug,
            pageType: page.pageType,
            content: page.content,
            sortOrder: page.sortOrder,
          },
          status: 'published',
        });
        results.created++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${page.title}: ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::about-page.about-page').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['images'],
    });

    if (!entity) {
      return ctx.notFound('About page not found');
    }

    return { data: entity };
  },

  async findByType(ctx) {
    const { pageType } = ctx.params;
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::about-page.about-page').findMany({
      where: { pageType, locale: locale || 'en' },
      orderBy: [{ sortOrder: 'asc' }],
      populate: ['images'],
    });

    return { data: entities };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::about-page.about-page').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['about-page'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::about-page.about-page').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::about-page.about-page').create({
          data: {
            title: item.title as string,
            content: item.content as string,
            slug: sourceRecord.slug,
            pageType: sourceRecord.pageType,
            sortOrder: sourceRecord.sortOrder,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate about page id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'about-page',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
