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

上海孚恩电子科技有限公司（Shanghai Fun Electronics Technology Co., Ltd.）是国内从事条码、RFID、物联网技术研究的企业，工业识别产品与解决方案提供商。

## 公司简介

产品涉及各频段RFID读写设备（固定式和手持式）、蓝牙RFID扫描枪、RFID工业平板和电子标签等，在生产制造、物流仓储、质量追溯、档案图书、设备巡检、防伪追溯、金融押运、智慧城市等应用领域已得到广泛应用。

## 产品领域

- **RFID读写器**：高频（HF 13.56MHz）、超高频（UHF 860-960MHz）、低频（LF 125KHz）、有源系列RFID读写器、工业协议网关控制器
- **RFID电子标签**：工业载码体、耐高温标签、抗金属标签、易碎防转移标签、智能卡与不干胶标签、特种标签、有源电子标签
- **智能移动终端**：多功能手持终端、多功能工业平板、便携式RFID读写器

## 品牌定位

国产替代品牌 — 工业RFID读头、RFID读写器、手持终端、工业PDA、手持机、RFID载码体、RFID物流门、资产管理、质量追溯`,
    imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/bitbug_favicon.ico',
  },
  {
    title: '公司实景',
    slug: 'company-scenery',
    pageType: 'gallery' as const,
    sortOrder: 2,
    content: `# 公司实景

展示上海孚恩电子科技有限公司的办公环境、生产车间、实验室等设施。`,
    imageUrl: '',
  },
  {
    title: '发展历程',
    slug: 'company-history',
    pageType: 'history' as const,
    sortOrder: 3,
    content: `# 发展历程

上海孚恩电子科技有限公司自成立以来，始终专注于RFID和物联网技术的研究与应用。

## 里程碑

- 公司成立，开始RFID读写器的研发与生产
- 推出高频系列RFID读写器，进入工业自动化市场
- 推出超高频系列RFID读写器，拓展物流仓储市场
- 推出智能移动终端产品线
- 推出RFID电子标签产品，完善产品体系
- 在光伏、汽车制造等行业应用取得突破`,
    imageUrl: '',
  },
  {
    title: '荣誉资质',
    slug: 'company-honors',
    pageType: 'honors' as const,
    sortOrder: 4,
    content: `# 荣誉资质

上海孚恩电子科技有限公司获得的多项荣誉和资质认证。`,
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
