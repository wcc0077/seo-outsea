import { factories } from '@strapi/strapi';
import https from 'https';
import http from 'http';
import { Readable } from 'stream';

const PRODUCTS = [
  { name: 'D1338T 工业级高频网口读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_p6nq.jpg' },
  { name: 'D1609 & D1339系列工业级高频读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2_yhtq.jpg' },
  { name: 'D1612 工业级高频读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_nuqm.jpg' },
  { name: 'D1621系列 IO-LINK高频RFID读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/3_nuqm.jpg' },
  { name: 'D1646T ModbusTCP 工业齐平式高频RFID读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4_3ji7.jpg' },
  { name: 'D1606 系列高频工业读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/8897.png' },
  { name: 'D1604 系列工业级高频读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D1604-1_o803.jpg' },
  { name: 'D1333系列工业级高频读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_1alu.webp' },
  { name: 'D1626系列IO-LINK高频RFID读写器', category: 'hf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2.webp' },
  { name: 'D2184B 高性能四通道UHF读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184B_x6b5.jpg' },
  { name: 'D2480系列 工业超高频RFID读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2480B_4f8u.jpg' },
  { name: 'D2381 工业级超高频读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D1108WD2381(3)_lunh.jpg' },
  { name: 'D2188BL超高频多通道读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2188.jpg' },
  { name: 'D2184BL超高频多通道读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2188BL.jpg' },
  { name: 'D2181B Lite 超高频读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2181Blite.jpg' },
  { name: 'D2184B Lite超高频读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2184Blite_6cwb.jpg' },
  { name: 'D2181R工业级超高频读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2181R.jpg' },
  { name: 'D2180U超高频桌面读写器', category: 'uhf-rfid-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/D2180U.jpg' },
  { name: 'M12 安卓手持终端', category: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_7bkj.jpg' },
  { name: 'M11 工业级手持终端', category: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11_lnf7.jpg' },
  { name: 'N60 智能打印手持终端', category: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/11_vljy.jpg' },
  { name: 'M11高工业级安卓条码手持终端', category: 'handheld-terminals', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/M11.png' },
  { name: 'P01 多功能工业平板', category: 'industrial-tablets', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_hd05.jpg' },
  { name: 'T01 蓝牙UHF扫描仪', category: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_xz3s_ou59.jpg' },
  { name: 'T02 蓝牙UHF扫描仪', category: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_jxgj_0wo1.jpg' },
  { name: 'T03 蓝牙UHF扫描仪', category: 'portable-readers', imageUrl: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/t03.png' },
];

const CATEGORIES = [
  { name: '高频系列RFID读写器', slug: 'hf-rfid-readers' },
  { name: '超高频系列RFID读写器', slug: 'uhf-rfid-readers' },
  { name: '多功能手持终端', slug: 'handheld-terminals' },
  { name: '多功能工业平板', slug: 'industrial-tablets' },
  { name: '便携式RFID读写器', slug: 'portable-readers' },
];

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

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::product.product').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['category', 'specs', 'images'],
    });

    if (!entity) {
      return ctx.notFound('Product not found');
    }

    return { data: entity };
  },

  async findByCategory(ctx) {
    const { categorySlug } = ctx.params;
    const { locale } = ctx.query;

    const category = await strapi.db.query('api::product-category.product-category').findOne({
      where: { slug: categorySlug, locale: locale || 'en' },
    });

    if (!category) {
      return ctx.notFound('Category not found');
    }

    const products = await strapi.db.query('api::product.product').findMany({
      where: { category: category.id, locale: locale || 'en' },
      populate: ['images', 'category'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: products, meta: { category } };
  },

  async importProducts(ctx) {
    const existingCount = await strapi.db.query('api::product.product').count();
    if (existingCount > 0) {
      return { data: null, error: `Products already exist (${existingCount}). Skipping import.` };
    }

    const results: { created: number; failed: number; categories: string[] } = { created: 0, failed: 0, categories: [] };

    // Create categories
    for (const cat of CATEGORIES) {
      const existing = await strapi.db.query('api::product-category.product-category').findOne({
        where: { slug: cat.slug },
      });
      if (existing) {
        results.categories.push(existing.slug);
        continue;
      }

      const category = await strapi.documents('api::product-category.product-category').create({
        data: { name: cat.name, slug: cat.slug },
      });
      results.categories.push(category.slug);
    }

    // Create products
    for (const product of PRODUCTS) {
      try {
        const slug = product.name
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        const model = product.name.match(/^([A-Z0-9]+)/)?.[1] || '';

        // Download and upload image
        let imageConnect: number[] = [];
        try {
          const filename = product.imageUrl.split('/').pop() || 'image.jpg';
          const buffer = await downloadImage(product.imageUrl);

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
          console.log(`  Image failed for ${product.name}: ${err.message}`);
        }

        // Find category documentId
        const category = await strapi.db.query('api::product-category.product-category').findOne({
          where: { slug: product.category },
        });

        await strapi.documents('api::product.product').create({
          data: {
            name: product.name,
            slug,
            description: `${product.name}\n\n工业级${model || 'RFID'}设备，适用于工业自动化场景。`,
            category: category?.documentId,
            images: imageConnect,
          },
        });

        results.created++;
      } catch (err: any) {
        results.failed++;
        console.error(`Failed: ${product.name}`, err.message);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    return { data: results };
  },

  async listAll(ctx) {
    const products = await strapi.db.query('api::product.product').findMany({
      populate: ['category'],
      orderBy: { updatedAt: 'desc' },
    });

    return { data: products };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::product.product').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['product'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::product.product').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::product.product').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            slug: sourceRecord.slug,
            locale: toLocale,
            category: sourceRecord.category,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate product id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'product',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
