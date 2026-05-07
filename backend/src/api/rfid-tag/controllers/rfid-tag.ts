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

// RFID Tag products scraped from fn-tech.com and knowledge base
const RFID_TAGS = [
  // 工业载码体
  { name: '工业载码体 HT001', model: 'HT001', tagType: 'carrier' as const, frequency: 'HF' as const, description: '工业级RFID载码体，适用于高温、高湿、高腐蚀等恶劣工业环境。采用特种工程塑料封装，具有优异的物理和化学性能。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  { name: '工业载码体 HT002', model: 'HT002', tagType: 'carrier' as const, frequency: 'HF' as const, description: '高性能工业载码体，专为工业自动化产线设计，支持高速读取和写入。适用于半导体制造、光伏电池片生产等精密制造场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2_jkc0.jpg' },
  // 耐高温标签
  { name: '耐高温RFID标签 HT201', model: 'HT201', tagType: 'high-temp' as const, frequency: 'HF' as const, description: '耐高温RFID标签，可在200°C以上高温环境下正常工作，适用于光伏电池片制造、SMT回流焊等高温工艺。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_ib9i.jpg' },
  { name: '耐高温RFID载码体 HT202', model: 'HT202', tagType: 'high-temp' as const, frequency: 'HF' as const, description: '太阳能光伏专用耐高温RFID载码体，可承受光伏电池片制造过程中的高温工艺，实现全流程追溯。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_ib9i.jpg' },
  { name: '耐高温RFID载码体 HT712', model: 'HT712', tagType: 'high-temp' as const, frequency: 'HF' as const, description: '高频工业级耐高温RFID载码体，适用于SMT产线、回流焊等高温场景，工作温度范围-40°C ~ +250°C。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2_jkc0.jpg' },
  // 抗金属标签
  { name: '抗金属标签 HT401', model: 'HT401', tagType: 'anti-metal' as const, frequency: 'HF' as const, description: '高频抗金属标签，可在金属表面正常工作，适用于金属工具、设备、模具等资产管理场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  { name: '抗金属标签 UT501', model: 'UT501', tagType: 'anti-metal' as const, frequency: 'UHF' as const, description: '超高频抗金属标签，远距离读取，适用于金属容器、托盘、货架等物流仓储场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_6s14.jpg' },
  { name: '抗金属标签 UT502', model: 'UT502', tagType: 'anti-metal' as const, frequency: 'UHF' as const, description: '超高频柔性抗金属标签，可弯曲贴合弧形金属表面，适用于金属管道、气瓶、刀具等异形金属表面标识。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_6s14.jpg' },
  // 易碎防转移标签
  { name: '易碎防转移标签 FT101', model: 'FT101', tagType: 'flexible' as const, frequency: 'HF' as const, description: '易碎防转移标签，一旦粘贴即无法完整移除，适用于防伪溯源、质保封条、门票等场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_ib9i.jpg' },
  { name: '易碎防转移标签 FT102', model: 'FT102', tagType: 'flexible' as const, frequency: 'UHF' as const, description: '超高频易碎防转移标签，远距离防伪溯源，适用于酒类、药品、奢侈品等高价值商品的防伪管理。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_ib9i.jpg' },
  // 智能卡与不干胶标签
  { name: 'RFID智能卡 CT301', model: 'CT301', tagType: 'card' as const, frequency: 'HF' as const, description: '标准RFID智能卡，兼容ISO14443A协议，适用于门禁、考勤、会员管理等场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  { name: 'RFID不干胶标签 LT302', model: 'LT302', tagType: 'card' as const, frequency: 'UHF' as const, description: '超高频不干胶标签，可批量打印和粘贴，适用于物流标签、仓储管理、零售商品标识等场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_6s14.jpg' },
  // 其他特种标签
  { name: 'RFID钥匙扣 KF401', model: 'KF401', tagType: 'key-fob' as const, frequency: 'HF' as const, description: 'RFID钥匙扣标签，便于随身携带，适用于门禁、考勤、巡检等场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  { name: 'RFID腕带 WB402', model: 'WB402', tagType: 'wristband' as const, frequency: 'HF' as const, description: 'RFID腕带标签，适用于人员识别、医疗管理、活动门票等场景，佩戴舒适，防水耐用。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  // 有源电子标签
  { name: '有源RFID标签 AT501', model: 'AT501', tagType: 'custom' as const, frequency: 'active' as const, description: '有源RFID标签，自带电池，远距离识别，适用于资产追踪、车辆管理、人员定位等远距离应用场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
  { name: '有源RFID标签 AT502', model: 'AT502', tagType: 'custom' as const, frequency: 'active' as const, description: '有源RFID标签，超长寿命设计，电池寿命3年以上，适用于智慧城市、车辆管理、小区安防等场景。', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_wdek.jpg' },
];

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::rfid-tag.rfid-tag', ({ strapi }) => ({
  async import(ctx) {
    const existingCount = await strapi.db.query('api::rfid-tag.rfid-tag').count();
    if (existingCount > 0) {
      return { data: null, error: `RFID tags already exist (${existingCount}). Skipping import.` };
    }

    const results: { created: number; failed: number; errors: string[] } = { created: 0, failed: 0, errors: [] };

    for (const tag of RFID_TAGS) {
      try {
        const slug = `${tag.model.toLowerCase()}-${tag.tagType}-${tag.frequency.toLowerCase()}`;

        // Download and upload image
        let imageConnect: number[] = [];
        try {
          const filename = tag.imageUrl.split('/').pop() || 'image.jpg';
          const buffer = await downloadImage(tag.imageUrl);

          const uploaded = await strapi.plugin('upload').services.upload.upload({
            data: {},
            files: {
              name: filename,
              type: 'image/jpeg',
              size: buffer.length,
              path: './',
              stream: Readable.from(buffer),
            },
          });

          if (Array.isArray(uploaded)) {
            imageConnect = uploaded.map((f: any) => f.id);
          } else if (uploaded) {
            imageConnect = [(uploaded as any).id];
          }
        } catch (err: any) {
          // Image failed, continue without image
        }

        await strapi.documents('api::rfid-tag.rfid-tag').create({
          data: {
            name: tag.name,
            model: tag.model,
            slug,
            tagType: tag.tagType,
            frequency: tag.frequency,
            description: tag.description,
            images: imageConnect,
            imageUrl: tag.imageUrl,
          },
          status: 'published',
        });
        results.created++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`${tag.name}: ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 200));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::rfid-tag.rfid-tag').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['images', 'specs'],
    });

    if (!entity) {
      return ctx.notFound('RFID tag not found');
    }

    return { data: entity };
  },

  async findByType(ctx) {
    const { type } = ctx.params;
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
      where: { tagType: type, locale: locale || 'en' },
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

    const records = await strapi.db.query('api::rfid-tag.rfid-tag').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['rfid-tag'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::rfid-tag.rfid-tag').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::rfid-tag.rfid-tag').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            applicationScenarios: item.applicationScenarios as string,
            slug: sourceRecord.slug,
            model: sourceRecord.model,
            tagType: sourceRecord.tagType,
            frequency: sourceRecord.frequency,
            imageUrl: sourceRecord.imageUrl,
            locale: toLocale,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate RFID tag id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'rfid-tag',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
