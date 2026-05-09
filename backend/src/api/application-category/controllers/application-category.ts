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

// 8 application categories
const APP_CATEGORIES = [
  {
    name: '智能制造',
    slug: 'smart-manufacturing',
    icon: 'factory',
    description: 'RFID技术在光伏、汽车制造、3C电子、半导体等智能制造场景的应用，实现生产全流程追溯与工序管理。',
    sortOrder: 1,
  },
  {
    name: '仓储物流',
    slug: 'warehouse-logistics',
    icon: 'warehouse',
    description: 'RFID技术在仓储管理、物流配送、叉车搬运等场景的应用，提高仓储周转效率，降低运营成本。',
    sortOrder: 2,
  },
  {
    name: '档案图书',
    slug: 'archive-library',
    icon: 'book',
    description: 'RFID技术在档案管理、图书借阅、数据中心光纤网络等场景的应用，实现资产全寿命周期管理。',
    sortOrder: 3,
  },
  {
    name: '资产巡检',
    slug: 'asset-inspection',
    icon: 'shield',
    description: 'RFID技术在设备巡检、工程车辆工具管理、电网资产全寿命周期管理等场景的应用。',
    sortOrder: 4,
  },
  {
    name: '防伪追溯',
    slug: 'anti-counterfeit',
    icon: 'check-shield',
    description: 'RFID技术在医药防伪、食品安全追溯等场景的应用，覆盖养殖、屠宰、加工、流通全过程监管。',
    sortOrder: 5,
  },
  {
    name: '零售与供应链',
    slug: 'retail-supply-chain',
    icon: 'cart',
    description: 'RFID技术在无人新零售、服装门店管理、供应链追溯等场景的应用，提升零售管理效率。',
    sortOrder: 6,
  },
  {
    name: '智慧城市',
    slug: 'smart-city',
    icon: 'city',
    description: 'RFID技术在车辆管理、智能小区电动自行车防盗、娱乐行业等智慧城市场景的应用。',
    sortOrder: 7,
  },
  {
    name: '智能柜体',
    slug: 'smart-cabinet',
    icon: 'grid',
    description: 'RFID技术在金融押运、智能储物柜、工具柜等柜体管理场景的应用。',
    sortOrder: 8,
  },
];

// Application cases from knowledge base
const APPLICATIONS = [
  // 智能制造 (smart-manufacturing)
  { name: 'RFID 技术与光伏电池片，共筑智能追溯未来', slug: 'rfid-solar-cell-traceability', categorySlug: 'smart-manufacturing', description: '光伏电池片生产过程的RFID追溯管理，实现生产全流程质量管控。', content: '在光伏电池片生产过程中，采用RFID技术实现从硅片到电池片的全流程追溯。耐高温载码体可承受电池片制造过程中的高温工艺，确保数据完整性和可追溯性。' },
  { name: 'RFID 追溯系统如何改写光伏切片工厂的命运轨迹', slug: 'rfid-solar-slicing-factory', categorySlug: 'smart-manufacturing', description: '光伏切片工厂的RFID追溯系统应用，提升生产效率和产品质量。', content: '光伏切片工厂引入RFID追溯系统后，实现了从原材料入库到成品出库的全流程跟踪，大幅提高了生产效率和产品质量管控能力。' },
  { name: '引领光伏拉晶厂智能追溯新纪元', slug: 'rfid-solar-crystal-pulling', categorySlug: 'smart-manufacturing', description: '光伏拉晶厂的智能追溯方案，实现生产工序RFID管理。', content: '光伏拉晶厂通过RFID技术实现从拉晶、切片到检测的全工序管理，每个环节的数据实时采集和分析，为生产决策提供可靠依据。' },
  { name: '基于RFID技术的汽车制造工业系统解决方案', slug: 'rfid-automotive-manufacturing', categorySlug: 'smart-manufacturing', description: '汽车制造产线RFID管理，实现总装线工序追踪和质量管理。', content: '在汽车总装生产线上，RFID技术实现了车身追踪、工序管理和质量追溯。抗金属标签可在复杂金属环境中稳定工作，确保数据采集的可靠性。' },
  { name: '破解刀具管理难题：RFID 技术革新', slug: 'rfid-cnc-tool-management', categorySlug: 'smart-manufacturing', description: '数控刀具RFID管理方案，延长刀具寿命，降低生产成本。', content: '通过RFID技术对数控刀具进行全生命周期管理，实时监控刀具使用次数、加工时间和维护状态，有效延长刀具使用寿命，降低生产成本。' },
  // 仓储物流 (warehouse-logistics)
  { name: '孚恩RFID叉车改造项目成功应用于深国际综合物流港', slug: 'rfid-forklift-logistics-port', categorySlug: 'warehouse-logistics', description: 'RFID叉车物流搬运应用案例，提升仓储作业效率。', content: '在深国际综合物流港项目中，通过RFID技术改造叉车，实现了货物自动识别、仓位自动匹配和作业数据实时上传，大幅提升了物流搬运效率。' },
  { name: '基于RFID技术的仓储物流管理系统应用方案', slug: 'rfid-warehouse-management-system', categorySlug: 'warehouse-logistics', description: '仓储物流RFID管理整体方案，提高生产效率、降低运营成本、提高仓储周转效率。', content: '基于RFID技术的仓储物流管理系统实现了入库、出库、盘点、移库等全流程自动化管理，提高了生产效率，降低了运营成本，提高了仓储周转效率。' },
  { name: '基于RFID技术的服装物流零售管理系统方案', slug: 'rfid-apparel-logistics-retail', categorySlug: 'warehouse-logistics', description: '服装物流零售管理，实现从工厂到门店的全流程追踪。', content: '在服装行业，RFID技术实现了从工厂生产、仓储物流到门店销售的全流程管理，有效解决了服装行业库存管理、快速盘点和防伪追溯等问题。' },
  // 档案图书 (archive-library)
  { name: '孚恩RFID技术在光纤数字化改造中的创新应用', slug: 'rfid-fiber-optic-data-center', categorySlug: 'archive-library', description: '数据中心光纤网络RFID管理，RFID非接触式识别、多标签同时读取、数据实时传输。', content: '在数据中心光纤网络改造中，RFID技术实现了光纤线缆的自动识别和管理，支持非接触式识别、多标签同时读取、数据实时传输等功能。' },
  { name: '基于RFID技术的电网资产全寿命周期管理解决方案', slug: 'rfid-power-grid-asset-management', categorySlug: 'archive-library', description: '电网资产PMS、PM与AM数据联动，资产全寿命周期管理一体化平台。', content: '基于RFID技术构建电网资产全寿命周期管理平台，实现PMS、PM与AM数据联动，从采购、入库、领用、运维到报废的全流程管理。' },
  { name: '基于RFID技术的移动工程车工具的资产信息自动管理方案', slug: 'rfid-engineering-vehicle-tool-tracking', categorySlug: 'archive-library', description: '电力工程车辆工具RFID管理，实现工具自动盘点和追踪。', content: '针对电力工程车辆工具管理难题，采用RFID技术实现工具的自动识别和追踪，有效防止工具丢失，提高工作效率。' },
  // 资产巡检 (asset-inspection)
  { name: '基于RFID图书智能管理技术的智慧书院方案', slug: 'rfid-smart-library-academy', categorySlug: 'asset-inspection', description: '朵云书院RFID智能管理，自动识别技术 + 无线电射频通信技术，非接触式数据采集。', content: '在朵云书院项目中，RFID图书智能管理技术实现了图书的自动借还、快速盘点和防盗功能，采用自动识别技术和无线电射频通信技术，实现非接触式数据采集。' },
  // 防伪追溯 (anti-counterfeit)
  { name: 'RFID医药防伪系统解决方案', slug: 'rfid-pharmaceutical-anti-counterfeit', categorySlug: 'anti-counterfeit', description: '医药产品RFID防伪，实现药品全流程追溯和防伪验证。', content: 'RFID医药防伪系统通过在药品包装中嵌入RFID标签，实现了从生产、流通到销售的全流程追溯，有效防止假冒伪劣药品流入市场。' },
  { name: 'RFID生猪肉品质量信息可溯源系统解决方案', slug: 'rfid-pork-food-traceability', categorySlug: 'anti-counterfeit', description: '猪肉食品安全追溯，覆盖养殖、屠宰、加工、流通、消费全过程监管。', content: 'RFID生猪肉品质量信息可溯源系统覆盖养殖、屠宰、加工、流通、消费全过程，实现从养殖场的饲养记录到屠宰加工、冷链物流、超市销售的全链条追溯。' },
  // 零售与供应链 (retail-supply-chain)
  { name: 'RFID技术在无人新零售中的应用', slug: 'rfid-unmanned-retail', categorySlug: 'retail-supply-chain', description: '无人零售RFID方案，实现自助结算和库存管理。', content: '在无人新零售场景中，RFID技术实现了商品自动识别、自助结算和实时库存管理，消费者只需选取商品即可自动完成结算，大幅提升了购物体验。' },
  { name: '基于手持终端的服装门店应用整体解决方案', slug: 'rfid-apparel-store-handheld', categorySlug: 'retail-supply-chain', description: '服装门店RFID管理，结合手持终端设备，实现快速盘点和库存管理。', content: '结合手持RFID终端设备，服装门店可以实现快速盘点、智能找货、库存查询等功能，将传统需要数小时的盘点工作缩短到几分钟。' },
  // 智慧城市 (smart-city)
  { name: 'RFID 技术：藏在娱乐里的 "黑科技"，让快乐再升级', slug: 'rfid-entertainment-technology', categorySlug: 'smart-city', description: '娱乐行业RFID应用，提升互动体验和管理效率。', content: 'RFID技术在娱乐行业的应用包括主题公园智能手环、演唱会智能门票、互动游戏身份识别等，为用户带来更加便捷和有趣的体验。' },
  { name: '基于RFID技术的智能车辆定位及测速系统解决方案', slug: 'rfid-vehicle-positioning-speed', categorySlug: 'smart-city', description: '车辆定位测速，RFID超低功耗技术，防水耐用，寿命3年以上。', content: '基于RFID技术的智能车辆定位及测速系统采用超低功耗设计，防水耐用，使用寿命3年以上，通过RFID全球唯一编码实现双向通讯，适用于车辆管理和调度场景。' },
  { name: '智能小区电动自行车RFID防盗管理解决方案', slug: 'rfid-e-bike-anti-theft', categorySlug: 'smart-city', description: '电动自行车防盗管理，实现出入自动记录和防盗预警。', content: '在智能小区中，RFID技术用于电动自行车的防盗管理，实现车辆出入自动记录、异常移动预警和车辆身份验证，有效降低电动自行车盗窃率。' },
  { name: '基于RFID射频识别技术的车辆管理应用解决方案', slug: 'rfid-fleet-management', categorySlug: 'smart-city', description: '停车场/小区车辆出入管理，公交/车队运输车辆调度管理。', content: '基于RFID射频识别技术的车辆管理系统应用于停车场、小区出入口管理，以及公交、车队运输车辆的智能调度，实现车辆自动识别、通行记录查询和费用结算。' },
  // 智能柜体 (smart-cabinet)
  { name: '武汉楚天威豹金融押运系统', slug: 'rfid-financial-escort-system', categorySlug: 'smart-cabinet', description: '金融押运RFID管理，实现押运过程全程追踪和安全管控。', content: '武汉楚天威豹金融押运系统采用RFID技术实现了押运箱的全程追踪和管理，从出库、运输、交接、入库到返回，每个环节都有详细记录，确保押运安全。' },
];

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::application-category.application-category', ({ strapi }) => ({
  async find(ctx) {
    const { locale } = ctx.query;

    const entities = await strapi.db.query('api::application-category.application-category').findMany({
      where: {
        locale: locale || 'en',
        publishedAt: { $notNull: true },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return { data: entities, meta: {} };
  },

  async import(ctx) {
    const existingCatCount = await strapi.db.query('api::application-category.application-category').count();
    const existingAppCount = await strapi.db.query('api::application.application').count();
    if (existingCatCount > 0 || existingAppCount > 0) {
      return { data: null, error: `Data already exists (categories: ${existingCatCount}, applications: ${existingAppCount}). Skipping import.` };
    }

    const results: { categories: number; applications: number; errors: string[] } = { categories: 0, applications: 0, errors: [] };

    // Step 1: Create categories (published)
    for (const cat of APP_CATEGORIES) {
      try {
        await strapi.documents('api::application-category.application-category').create({
          data: {
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            description: cat.description,
            sortOrder: cat.sortOrder,
          },
          status: 'published',
        });
        results.categories++;
      } catch (err: any) {
        results.errors.push(`Category failed: ${cat.name} - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    // Step 2: Create applications with category relations (published)
    const categoryMap: Record<string, number> = {};
    const allCategories = await strapi.db.query('api::application-category.application-category').findMany({});
    for (const cat of allCategories) {
      categoryMap[cat.slug] = cat.id;
    }

    for (const app of APPLICATIONS) {
      try {
        const catId = categoryMap[app.categorySlug];
        await strapi.documents('api::application.application').create({
          data: {
            name: app.name,
            slug: app.slug,
            description: app.description,
            useCase: app.content,
            category: catId || null,
          },
          status: 'published',
        });
        results.applications++;
      } catch (err: any) {
        results.errors.push(`Application failed: ${app.name} - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::application-category.application-category').findOne({
      where: { slug, locale: locale || 'en' },
      populate: ['applications'],
    });

    if (!entity) {
      return ctx.notFound('Application category not found');
    }

    return { data: entity };
  },

  async translate(ctx) {
    const { fromLocale, toLocale } = ctx.request.body as { fromLocale: string; toLocale: string };

    if (!fromLocale || !toLocale) {
      return ctx.badRequest('Missing fromLocale or toLocale');
    }

    const { buildTranslatePayload, callDeepSeekTranslate, TRANSLATABLE_FIELDS } = await import('../../../utils/translate');

    const records = await strapi.db.query('api::application-category.application-category').findMany({
      where: { locale: fromLocale },
    });

    if (records.length === 0) {
      return { success: false, message: `No ${fromLocale} records found` };
    }

    const fields = TRANSLATABLE_FIELDS['application-category'];
    const payload = buildTranslatePayload(records, fields);

    const translated = await callDeepSeekTranslate(fromLocale, toLocale, payload);

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of translated) {
      try {
        const sourceRecord = records.find((r) => r.id === item._id);
        if (!sourceRecord?.slug) continue;

        const existing = await strapi.db.query('api::application-category.application-category').findOne({
          where: { slug: sourceRecord.slug, locale: toLocale },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await strapi.db.query('api::application-category.application-category').create({
          data: {
            name: item.name as string,
            description: item.description as string,
            slug: sourceRecord.slug,
            icon: sourceRecord.icon,
            locale: toLocale,
            sortOrder: sourceRecord.sortOrder,
            publishedAt: sourceRecord.publishedAt || new Date().toISOString(),
          },
        });
        created++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Failed to translate application category id=${item._id}: ${msg}`);
      }
    }

    return {
      success: true,
      contentType: 'application-category',
      fromLocale,
      toLocale,
      translated: created,
      skipped,
      failed: errors.length,
      errors,
    };
  },
}));
