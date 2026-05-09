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

// 8 application categories (from fn-tech.com)
const APP_CATEGORIES = [
  {
    name: '智能智造',
    slug: 'smart-manufacturing',
    icon: 'factory',
    description: 'RFID技术在光伏电池片、切片、拉晶等光伏制造场景及数控刀具管理中的应用，实现生产全流程追溯、质量管控与工业4.0智能化转型。',
    sortOrder: 1,
  },
  {
    name: '仓储物流',
    slug: 'warehouse-logistics',
    icon: 'warehouse',
    description: 'RFID技术在AGV/RGV叉车改造、汽车零部件物流、服装零售管理等场景的应用，实现仓储物流全流程自动化管理与效率提升。',
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
    description: 'RFID技术在数据中心光纤线缆管理、设备巡检等场景的应用，提升运维效率300%，降低人工差错率至0.5%以下。',
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
    name: '连锁零售',
    slug: 'retail-supply-chain',
    icon: 'cart',
    description: 'RFID技术在无人新零售、服装门店管理、供应链追溯等场景的应用，提升零售管理效率。',
    sortOrder: 6,
  },
  {
    name: '智慧城市',
    slug: 'smart-city',
    icon: 'city',
    description: 'RFID技术在娱乐行业、主题公园、水上乐园、赌场等场景的创新应用，让娱乐更便捷、安全、有趣，提升运营效率60%。',
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

// 28 application cases scraped from fn-tech.com (2026-05-09)
// Each has: name, slug, categorySlug, description, content, image (stored for reference)
const APPLICATIONS = [
  // 智能智造 (smart-manufacturing) — 5 applications
  {
    name: '破解刀具管理难题：RFID 技术革新',
    slug: 'rfid-cnc-tool-management',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/4.webp',
    description: '采用抗油污、抗粉尘 RFID 标签作为刀具电子身份证，结合手持式与固定式读写设备，实时采集刀具数据，解决错拿、漏拿及寿命管理难题，助力企业迈向工业 4.0 智能化转型。',
    content: '在现代工业制造领域，数控技术的飞速发展正以前所未有的速度重塑生产格局。设备更新迭代不断加速，加工零件品种向着多元化、精细化方向持续突破，这一切都推动着生产环节对刀具的需求呈现爆发式增长。\n\n然而，传统的刀具管理方式却逐渐成为制约生产效率的 "瓶颈"。手工管理模式下，工作人员需要在海量刀具中人工寻找所需型号，不仅耗时费力，还极易出现错拿、漏拿的情况；而纸质条码管理方式同样弊端明显，车间复杂的生产环境中，油污、粉尘等很容易附着在纸质条码上，导致条码信息无法正常读取。\n\nRFID 刀具管理系统通过在每一把工刀具上附着唯一的 RFID 标签，并结合专业的读写设备与功能强大的后台软件系统，构建起一套覆盖刀具全生命周期的智能化管理体系。RFID 标签作为刀具的 "电子身份证"，内置了先进的电子芯片与天线，能够稳定存储刀具的型号、规格、出厂信息、使用记录等关键数据，且标签具备良好的抗油污、抗粉尘性能。',
  },
  {
    name: 'RFID 技术与光伏电池片，共筑智能追溯未来',
    slug: 'rfid-solar-cell-traceability',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/80922EBD328A8CDB43DE7D7876BEB84D.jpg',
    description: '采用高性能 HF 读写器与多样化读头，适应严苛工业环境，实现花篮全流程动态追踪。耐高温防水电子标签，IP68 防护，50 万次擦写寿命，无缝对接 MES 系统。',
    content: '随着光伏市场需求的持续增长，电池片生产规模不断扩大。在传统生产模式下，光伏电池片从原材料投入到成品产出，要经过制绒、扩散、激光 SE、刻蚀等多道复杂工序。生产过程中，在制品通过塑料花篮载具装载流转，采用 AGV 或人工搬运。由于工序繁多、流转环节复杂，传统的人工记录或条码识别方式难以实现高效精准的生产信息采集和全程质量追溯。\n\n孚恩科技基于 RFID 技术的光伏电池片追溯解决方案：\n\n1. 多样化读头选择：提供圆柱体、方形、薄片三种不同类型的 RFID 读头，适应不同机台结构的安装需求。\n\n2. 高性能读写器：D1606R/D1604R 是一款高性能的 HF 频段 ISO15693 协议的工业级电子标签读写器。IP67 高工业防护等级封装。\n\n3. 可靠的工业控制网关：FN-E1684B 等工业控制网关，支持 EthernetIP、ModbusTCP、Profinet 等多种通信协议。\n\n4. 耐用的电子标签：针对光伏电池片生产过程中花篮需经过酸槽和碱槽的特殊环境，RFID 电子标签具备耐高温、耐磨、防腐蚀、防水等特性。防护等级达到 IP68，擦写寿命高达 50 万次。',
  },
  {
    name: 'RFID 追溯系统如何改写光伏切片工厂的命运轨迹',
    slug: 'rfid-solar-slicing-traceability',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/vjw6.PNG',
    description: '巧妙应用超高频与高频 RFID 技术，实现粘棒、切片、脱胶、插片清洗分选全流程自动化数据采集，无缝对接 MES 系统。',
    content: '在全球环保需求推动下，中国光伏行业迅猛发展，已成为全球最大太阳能电池生产国。然而，伴随产能激增，企业质量管理短板凸显：生产数据依赖人工记录，信息滞后且易错漏；传统条码在油污、高温等恶劣环境下易失效。\n\n针对切片车间前段和后段不同的工艺环境，项目团队巧妙地采用了超高频 RFID 和高频 RFID 技术：\n\n1. 粘棒环节：根据配棒分组信息上料，工作人员用 PDA 扫描晶托录入追溯信息，再通过 RFID 固定读写器和条码扫描器，把晶托和硅棒绑定。\n\n2. 切片环节：上料时，RFID 读写器自动采集晶托信息并传给切片机台，再由机台上传给 MES 系统。\n\n3. 脱胶环节：脱胶上料和下料口都安装了 RFID 超高频读写器，自动读取晶托信息并上传。\n\n4. 插片清洗分选环节：插片上料口和分选口的 RFID 高频读写器，在提取花篮前自动读取信息。',
  },
  {
    name: '引领光伏拉晶厂智能追溯新纪元',
    slug: 'rfid-solar-crystal-pulling-traceability',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/222.PNG',
    description: '通过高效稳定的 RFID 读写器和电子标签，实现硅棒生产全流程精准追踪与数据自动采集，适配高温强酸碱等恶劣环境，良品率提高近 20%。',
    content: '光伏拉晶厂的生产过程复杂且精细，从硅料的清洗、投料到拉晶、机加，每一个环节都对产品质量有着至关重要的影响。然而，传统的人工记录或条码扫描方式存在易错、易漏、效率低下等问题。\n\n孚恩科技推出了基于 RFID 技术的全过程追溯应用解决方案。该方案通过在整个生产流程中嵌入 RFID 电子标签和读写器，实现了对硅棒生产全过程的精准追踪和高效管理。\n\n精准追踪，保障质量：从机加工硅棒切断起，孚恩科技把硅棒与托盘 RFID 绑定。后续工序借助 RFID 采集数据，实现生产全程跟踪管理。\n\n自动采集，提升效率：孚恩科技的 RFID 读写器读写性能高效稳定，恶劣生产环境下也能精准采集数据。与 MES 系统无缝对接。\n\n该方案已在多家光伏拉晶厂成功应用，良品率提高了近 20%。',
  },
  {
    name: 'RFID 服装生产线的应用',
    slug: 'rfid-garment-production-line',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '中国是服装生产与消费大国，但行业受单品数量多、手工数据收集低效、仓库盘点难、货物周转慢等问题制约。RFID 服装生产线应用可破解这些痛点，搭配 FN HFD1008 固定读写器。',
    content: '中国是服装消费国和生产国，随着中国经济的快速发展，服装行业在不断快速发展并稳步前进。然而，服装行业本身所具有的特点（如季节性、地域性的差异化，市场的变化性，产品的多类性等），企业管理制度的不完善，以及市场竞争的激烈化，使服装企业面临着巨大的困难与挑战。\n\n服装企业有其特殊的行业特性，其产品的款式、颜色、尺码组合的特点决定了其单品数量随款式的增加而呈几何级增长。显然，传统的手工收集销售、物流、盘点、调配等环节的大量数据已不现实。\n\nRFID 采集的实时数据实现生产管理系统对车间生产情况的实时监控和调整，可实现柔性化生产；生产信息的实时反馈与跟踪保证了生产质量的实时分析与处理，达到生产质量的实时控制，降低废品率和提高产品质量；RFID 大大降低了企业库存、劳动力、生产时间、废品等造成的生产成本。',
  },
  // 仓储物流 (warehouse-logistics) — 5 applications
  {
    name: 'AGV/RGV 升级"智慧大脑"！孚恩 RFID 让物流生产效率翻番',
    slug: 'rfid-agv-rgv-smart-logistics',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_izn0.webp',
    description: 'RFID 叉车自动化识别解决方案，集成工业平板与 RFID 读写器，实现托盘货物自动上架、下架及移库操作，减少人为失误，确保数据实时准确。',
    content: 'AGV 是自动导引运输车，装备有电磁或光学等自动导引装置，能够沿规定的导引路径行驶。RGV 是有轨制导车辆，又叫有轨穿梭小车，适用于高密度仓库。\n\n在工业 4.0 和 "中国制造 2025" 的浪潮下，"无人化、智能化" 早已不是选择题，而是生存题。当 AGV/RGV 遇上 RFID 技术，上海孚恩电子科技用 19 年 RFID 技术沉淀，为 AGV/RGV 装上 "智慧大脑"。\n\n在 AGV/RGV 上装 RFID 读写器，在地面、轨道、货架或物料上贴专属 RFID 标签。这些标签就像 "智能路标 + 信息卡片"，AGV/RGV 一 "读" 就知道自己在哪、该做什么，还能实时把物料信息传回系统。搭配标准工业通信协议，和企业现有系统无缝对接。',
  },
  {
    name: '优化汽车仓储物流管理',
    slug: 'rfid-auto-parts-logistics',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/2yt2.PNG',
    description: '通过 RFID 技术实现零部件物流全程可追溯，包括地感红外方向判断与 RFID 门禁通道两种方案，支持实时信息上传与叉车读写器数据采集。',
    content: '随着汽车制造业的快速发展，零部件的供应链管理变得越来越复杂，涉及多个环节和多个参与方。为了确保零部件的质量、可追溯性以及物流效率，传统的物流管理方式已经无法满足现代汽车制造业的需求。\n\nRFID 物流门提供了地感 / 红外判断进出方向和 RFID 门禁通道两种方案。前者通过地感开关和读写器实现叉车进出方向判断及器具信息读取，后者以快速出入库通道形式，集成多种功能，对出入零部件实时监控并将信息发送至数据库。\n\n当叉车通过物流门的时候，依次触发地感开关，启动读写器进行器具信息读取，并自动判断出库或入库状态。物流门扫到器具信息后通过中间件平台上传至业务系统中。',
  },
  {
    name: '孚恩 RFID 叉车改造项目成功应用于深国际综合物流港',
    slug: 'rfid-forklift-logistics-port',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png',
    description: '集成工业平板与 RFID 读写器，实现托盘货物自动上架、下架及移库操作，减少人为失误，确保数据实时准确。适用于物流港、仓库等场景。',
    content: '叉车在企业的物流系统中扮演着非常重要的角色，是物料搬运设备中的主力军。广泛应用于厂矿、仓库、车站、港口、机场、货场、流通中心和配送中心等场所。\n\n针对于搬运叉车进行 RFID 自动识别技术的改造，在叉车上集成工业平板、RFID 读写器、RFID 天线。托盘上安装 RFID 电子标签，叉车 RFID 天线自动识别叉臂上的托盘 RFID 信息，对托盘上的货物进行上架、下架、移库等仓储作业。RFID 技术与数字化仓库系统结合，提高仓储环节的自动化和智能化，增强了库存管理的及时性和准确性。',
  },
  {
    name: '基于 RFID 仓储物流管理系统解决方案',
    slug: 'rfid-warehouse-logistics-management',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458549141_73l4.jpg',
    description: '基于 RFID 技术的仓储物流管理系统，引入 RFID 电子标签、手持 PDA、无线网络等技术，实现入库、出库、盘库、移库全流程自动化管理，大幅提升仓库管理效率与数据准确性。',
    content: '物流是指原材料、产成品从起点至终点及相关信息有效流动的过程。现代物流运用全新的管理理念，通过对物流全过程多要素的计划、实施和控制，将运输、仓储、装卸、加工、整理、配送、信息等环节有机地结合，形成完整的供应链。\n\n传统的仓库管理一般依赖于一个非自动化的、以纸张文件为基础的系统来记录、追踪进出的货物。随着企业规模的不断发展，仓库管理的物资种类数量在不断增加、出入库频率剧增，传统的人工仓库作业模式和数据采集方式已难以满足仓库管理的快速、准确要求。\n\n基于射频识别（RFID）的仓库管理系统是在现有仓库管理中引入 RFID 技术，对仓库的到货检验、入库、出库、调拨、发货、盘库等各个作业环节进行智能化控制，实现对仓库物资的精确跟踪和实时管理。\n\n系统通过库位标签的制作与安装、手持 PDA 读取电子标签数据、通过 GPRS 将数据发送到数据接收器并更新数据库，完成入库、出库、盘库、移库等操作的数据传输与更新。',
  },
  {
    name: '基于 RFID 技术的仓储物流管理系统应用方案',
    slug: 'rfid-warehouse-logistics-application',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '企业为降本提效需优化仓储物流，此 RFID 仓储物流管理方案可满足需求，目标含降低 20-30% 人工、实现 99% 货物可视化等。入库用固定式读写器批量识别标签核货；出库分批量与少量核查，错漏即预警；盘点靠手持终端快速扫描比对。',
    content: '目前，市场竞争日益激烈，提高生产效率、降低运营成本，对于企业来说至关重要。仓储物流管理广泛应用于各个行业，设计及建立健全整套的仓储管理流程，提高仓储周转效率，减少运营资金的占用，使冻结的资产变成现金。\n\n方案目标：人工可降低 20-30%；99% 的仓库产品可视化；改良的供应链管理将降低 20-25% 的工作服务时间；提高仓储信息的准确性与可靠性。\n\n入库管理：在仓库的门口部署 RFID 固定式读写器，根据现场环境进行射频规划，保证 RFID 电子标签不被漏读。当采集 RFID 标签完成后，会与订单进行比对，核对货物数量及型号是否正确。\n\n出库管理：如果出库数量较多时，将货物呈批推到仓库门口，利用固定式读写器与标签通信，对出库的货物的 RFID 电子标签采集，检查是否与计划对应。\n\n盘点管理：利用 RFID 手持式的终端进行货物盘点扫描，盘点信息可以通过无线网络传入后台数据库，并与数据库中的信息进行比对，生成差异信息实时显示在 RFID 手持终端上。\n\n基本信息管理：对货物的属性进行设置管理，主要功能有添加、编辑、删除、查询仓库中存贮货物的基本属性。各层级仓库管理人员可以针对不同维度的库存信息进行查询与相关的业务操作。\n\n系统信息管理：充分考虑系统的扩展性与安全性，提供合理的、确保系统安全的工具。完成权限分配、数据表单的增加、修改、删除等操作。具有完备的登录程序，不同的人员赋予不同的权限。\n\n数据统计分析：系统可以按照时间、数量等要素，形成统计报表，明晰周转周期和效率，方便对库存管理业务流程的计划和控制。',
  },
  {
    name: '基于 RFID 技术的服装物流零售管理系统方案',
    slug: 'rfid-garment-logistics-retail',
    categorySlug: 'warehouse-logistics',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '上海孚恩的 RFID 服装物流零售管理系统，以 RFID 服装标签与孚恩 M11 手持终端为核心，覆盖总部仓库批量出入库、门店进销存、会员管理等全链路。',
    content: '本方案综合了 RFID 技术、网络技术、计算机技术、数据库技术和无线通讯技术。\n\n在总部仓库实现货物的批量快速出入库，以缩短整体供货周期；在门店实现进销存实时统计与快速补货；在渠道管理上可追踪渠道物流信息，实现货物的防窜货。\n\nRFID 收发货通道完成一箱衣服的扫描只需 12-15 秒钟，一天工作 10 小时可完成对 72000-96000 件服装的出入库操作。门店销售管理：顾客到收银前台结算，收银员将衣服堆放在 RFID 扫描平台上，电脑上即显示出选购货物的明细列表并自动计算出总金额。',
  },
  // 资产巡检 (asset-inspection) — 3 applications
  {
    name: '孚恩 RFID 技术在光纤数字化改造中的创新应用',
    slug: 'rfid-fiber-optic-data-center',
    categorySlug: 'asset-inspection',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp',
    description: '通过超高频 RFID 标签与智能手持设备，实现数据中心光纤资源自动化识别、实时追踪与智能管理，提升运维效率 300%，降低人工差错率至 0.5% 以下。',
    content: '在数字化浪潮下，数据中心、电信运营商等领域的光纤网络规模持续扩张，传统光纤管理模式已难以应对复杂的资源调度与运维需求。\n\n行业核心痛点：\n\n1. 跳线管理困境：单条机柜可能连接数十甚至上百条光纤跳线，人工插拔单次操作耗时 5-10 分钟。\n\n2. 台账更新滞后：部分机房台账准确率不足 70%。\n\n3. 状态不透明：闲置光纤缺乏实时感知手段，资源复用率低。\n\n4. 盘点难度大：覆盖一个中型机房需 2-3 人 / 天，资源闲置率高达 20%-30%。\n\n5. 链路定位困难：光纤故障平均定位时间超过 4 小时。\n\nRFID 解决方案：采用超高频（UHF）光纤标签，卡扣在光纤跳线两端的连接器或线缆表面。运维人员使用 RFID 手持终端进行查找巡检等操作。提升运维效率 300%，降低人工差错率至 0.5% 以下。',
  },
  {
    name: '基于 RFID 技术的移动工程车工具的资产信息自动管理方案',
    slug: 'rfid-mobile-engineering-vehicle-tools',
    categorySlug: 'asset-inspection',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '基于 RFID 技术的移动工程车工具资产信息自动管理方案，可解决电力抢修中工具丢失、信息不明导致的抢修延误问题。搭配孚恩 D2184 固定读写器与 M11 手持终端。',
    content: '如果突然造成电力故障，从大的来讲，需求电力运作的工业无法运作，给国家给企业带来巨大的损失。而电力工程师在抢修的时候，对于工具信息的情况可能不会非常了解。\n\n基于 RFID 技术的移动工程车工具资产信息自动管理方案：为工具绑定超高频 / 抗金属 RFID 标签并录入资产信息，搭配孚恩 D2184 固定读写器与 M11 手持终端，通过车载工控机实时扫描工具标签：超时未读判定为领用，归还后识别入库，未还则报警。工具丢失可借手持终端查找，任务数据最终上传服务器存档。',
  },
  {
    name: '基于 RFID 射频识别技术的车辆管理应用解决方案',
    slug: 'rfid-vehicle-management',
    categorySlug: 'asset-inspection',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '基于 RFID 的车辆管理解决方案，以孚恩 UHF 远距离 IC 卡读写器 D2181 和汽车专用 RFID 标签为核心，适用于停车场、小区、公交车队等场景，读写距离达 8 米。',
    content: '本方案是基于 RFID 射频识别技术的远距离车辆智能管理系统方案，既能应用于停车场、小区等地方的车辆出入管理，也能应用于公交、车队等运输车辆调度管理。\n\n应用于停车场收费管理与进出车辆控制时，车主无需停车即可出入停车场，通过电脑自动识别持卡人身份，确定对车是放行或拦截。\n\n系统主要由入口读卡器、控制器设备、入口栏杆机、出口读卡器、出口栏杆机、收费与监控管理中心组成。电子标识卡是一种无源电子射频卡，射频频率为 860-927Mhz。孚恩公司的 UHF 读写器读写距离达到 8 米，读写时车辆运动速度可达 120km/h。',
  },
  // 防伪追溯 (anti-counterfeit) — 3 applications
  {
    name: 'RFID 医药防伪系统解决方案',
    slug: 'rfid-pharma-anti-counterfeit',
    categorySlug: 'anti-counterfeit',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '聚焦药品防伪与监管痛点，依托 RFID 技术提供全链路实操方案。生产端为药品贴 HF（小包装）、UHF（纸箱）标签。',
    content: '药品是一种较特殊的产品，主要的作用还是治病救人。而在药品这个最大的被迫消费市场上，在丰厚的利润诱导下，药品中的假货不仅是药品生产厂家的天敌，更使得消费者购药时心惊胆战。\n\n利用 RFID 技术建设的药品 RFID 供应链信息平台，可以实现药品在生产、流通、销售等各个环节的实时跟踪和监管。由于 RFID 电子标签具有存储容量大、传输速度快、不可仿冒、可并发识别等技术特点。\n\n制药企业作为药品的生产商，负责在药品包装上加贴 RFID 电子标签。药品 RFID 电子标签分为两种，一种为贴在每个销售单位的药品小包装盒上的 HF 标签，另一种为贴于包装纸箱上的 UHF 标签。流通相关单位配置专用的 RFID 可鉴别读写器具。药监部门可以使用手持式可鉴别读写机具，对药品流通相关单位的在库和在售药品进行现场检查和鉴别。',
  },
  {
    name: 'RFID 生猪肉品质量信息可溯源系统解决方案',
    slug: 'rfid-pork-meat-traceability',
    categorySlug: 'anti-counterfeit',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '针对猪肉占肉类消费超 60% 但监管体系不足的问题，结合食品安全法与 RFID 物联网技术打造，覆盖养殖到零售全链路。',
    content: '据中国肉类协会数据，猪肉食品在整个肉类食品中占了 60% 以上，猪肉卫生和质量安全直接关系人民群众身体健康和生命安全。\n\n孚恩生猪肉品质量信息溯源系统依照商务部的 "放心肉" 服务体系，建立三大系统，即屠宰监管支撑系统、肉品质量安全可追溯系统、肉品冷链管理系统。将生猪养殖、屠宰和肉品加工、运输、批发、零售等纳入猪肉供应链全程在线监管。\n\n养殖环节：仔猪出栏后将佩戴 RFID 电子耳标，并通过该电子耳标关联小猪的上辈信息。\n\n屠宰环节：合格的猪肉白条绑定射频识别溯源标签，在出厂时射频识别通道获取的猪肉代码与 RFID 溯源一体机获取的下游销售商的 RFID 身份卡信息自动关联。\n\n消费者通过自助查询终端、互联网、查询电话、短信等方式输入生猪肉制品溯源代码，进行质量信息追溯查询。',
  },
  {
    name: '基于 RFID 技术的水泥出库及运输产品安全的解决方案',
    slug: 'rfid-cement-outbound-transport',
    categorySlug: 'anti-counterfeit',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '针对水泥行业仿冒多、信息化保守、运输易被替换的痛点，以超高频 RFID 为核心，结合物联与手持终端技术。',
    content: '建筑原材料等行业，竞争也越来越激烈。一些不法商家针对于一些质量上、品牌上、性能上比较过硬的优质产品进行包装的仿冒，以次充好，进入市场，不但对使用者造成安全方面的隐患，更对生产厂家的产品质量信誉造成不可挽回的影响和损失。\n\n上海孚恩电子科技有限公司提出以超高频 RFID 为技术核心，结合物联技术、无线通讯技术、手持终端技术等多种先进技术进行水泥出库、运输物流、交接产品质量安全防伪防盗等完整解决方案。\n\n选取超高频 RFID 标签，在水泥包装袋加工的时候，植入包装袋夹层。将具有唯一 ID 号的 RFID 标签与实际的一件一件货物一一关联，使得每一件货物也相应有了自己的唯一身份。',
  },
  // 连锁零售 (retail-supply-chain) — 1 application
  {
    name: '服装连锁门店条码解决方案',
    slug: 'garment-chain-store-barcode',
    categorySlug: 'retail-supply-chain',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '中国是服装产销大国，但行业受单品多、门店分散、手工数据低效等困扰。该方案搭配孚恩 M11 手持终端与桌面式 POS 机，覆盖全流程。',
    content: '中国是服装消费国和生产国，随着中国经济的快速发展，服装行业在不断快速发展并稳步前进。然而，服装行业本身所具有的特点，企业管理制度的不完善，以及市场竞争的激烈化，使服装企业面临着巨大的困难与挑战。\n\n服装连锁门店条码解决方案搭配孚恩 M11 手持终端与桌面式 POS 机，覆盖全流程：扫码完成销售、实时录订货补货信息，收货核对精准高效；仓库管理含入库、出库、移库操作，盘点可自动核数据出盈亏；还能管理会员消费（数据实时传总部）、执行日结查进销存，支持货物调拨与多维度查询。',
  },
  // 智慧城市 (smart-city) — 2 applications
  {
    name: '智能小区电动自行车 RFID 防盗管理解决方案',
    slug: 'smart-residential-ev-anti-theft',
    categorySlug: 'smart-city',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '智能小区电动自行车 RFID 防盗方案，可解决电动车被盗率高、传统防盗误报多或成本高的问题。方案为每车配车载与车主携带的两张有源 RFID 标签，搭配孚恩远距离读写器，在小区门口及公共区域部署，通过双卡匹配判断：不匹配则报警，匹配则传正常数据。',
    content: '近年来，电动自行车在路上随处可见，与自行车相比，省力更轻松快捷；与汽车相比，行程更自由更环保，不受交通堵塞情况影响。诸多优点集合，电动自行车大受欢迎。随之而来的电动自行车偷盗事件也接连发生。\n\n目前市场上常见电动自行车防盗装置是遥控防盗报警器，这类报警器灵敏度较高，报警声响可达 100 分贝以上，但是此类装置误报率较高，如刮风打雷，儿童嬉闹等，都有可能触发报警器报警。\n\n本方案采用先进的 RFID 超低功耗技术，坚固耐用、防水且寿命达 3 年以上。"电动车防盗管理系统" 包含两大部分，一个是以小区为单位，在小区进出门口安装远距离读写器，对进出门口的电动自行车进行数据采集及盗窃报警。二是扩展到每个街道路面，在路口、大型超市门口、医院、菜市场等人多车多区域安装远距离读写器，并与社会面监控系统、"110" 指挥中心联网运作。\n\n每辆车配两张有源 RFID 电子标签，一张安装在电动自行车上，一张车主随身携带。当电动自行车通过时，系统获取的车辆内电子标签信息与车主随身携带的电子标签信息无法正确匹配后，上传报警信号。\n\n提升可管理性：双卡关联识别，车辆信息系统管理，信息实名制化，大大提升了电动车的可管理性。降低管理成本：更高的效率和更可控的单车防盗措施，大大降低了电动车的被盗概率。',
  },
  {
    name: 'RFID 技术：藏在娱乐里的 "黑科技"，让快乐再升级',
    slug: 'rfid-entertainment-technology',
    categorySlug: 'smart-city',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/jucg.png',
    description: '从主题乐园魔法手环到水上乐园防水腕带、赌场防伪筹码和大型活动互动门票，RFID 让娱乐更便捷、安全、有趣，提升运营效率 60%，减少欺诈 80%。',
    content: '周末去主题乐园，还在为检票长队烦躁？去水上乐园，总担心手机沾水没法付款？参加音乐节，想和舞台互动却找不到方式？如今，这些烦恼都被一项 "隐形技术" 解决了 —— 它就是 RFID（射频识别）技术。\n\n主题乐园：上海迪士尼的 "魔法手环" 早已圈粉无数。入园时手腕轻轻一碰闸机，1 秒就能通过。\n\n水上乐园：广州长隆水上乐园的防水 RFID 腕带，泡在造浪池里几小时也不会坏，既是入园凭证，又是 "万能工具" —— 刷腕带打开储物箱、靠近支付终端完成付款。\n\n赌场筹码：在澳门的高端赌场里，RFID 技术成了 "公平卫士"。每枚筹码里都嵌了专属芯片，从下注到兑换全程监控，防伪筹码作弊。\n\n互动门票：在音乐节、动漫展等活动中，RFID 门票能玩出不少新花样。\n\nRFID 技术让娱乐更便捷、安全、有趣，提升运营效率 60%，减少欺诈 80%。未来结合 AI 与大数据，个性化推荐将更精准。',
  },
  // === Additional applications (9 more, total 28) ===
  // 档案图书 (archive-library) — 1 application
  {
    name: '朵云书院智慧管理 孚恩 RFID 来助力',
    slug: 'rfid-duoyun-smart-library',
    categorySlug: 'archive-library',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '上海中心 52 层（239 米高空）的朵云书院，2000 多㎡内有 6 万多册书。采用孚恩 RFID 智能馆藏系统，图书贴 RFID 标签，出口装 D2184B 超高频读写器防盗，盘点用 M11 手持终端，一人半天完成原需多人数月的工作量。',
    content: '随着时代的快速发展，学习的需求愈加强烈，知识经济现象也日益显著，书店书院已成为咨询服务的常去之地。\n\n上海中心大厦 52 层的朵云书院，在离地 239 米的空中、2000 多平方米的空间内，售卖 16000 多种、6 万多册中外书籍。书店集阅读、艺术展览、品牌文创、社交休闲等多功能于一体。\n\nRFID "智能馆藏系统" 包含了馆员服务系统、芯片转换系统、馆藏盘查系统、通道侦查系统等一系列自动化管理系统。每一本图书都贴上 RFID 标签，RFID 检查机被安装在书店的出口报警 LED 灯带处。当有人离开书店时携带没有被检查的贴着 RFID 标签的图书时，RFID 检查机就会响起警报。\n\n书店盘点时，管理员只需手持馆藏盘查系统在书架上横移即可读取图书信息。原来需要几个人几个月的工作量，一个人半天就可以完成，同时可以很容易找到不在书架或者乱架的图书。',
  },
  // 资产巡检 (asset-inspection) — additional 2 applications
  {
    name: '基于 RFID 技术的智能车辆定位及测速系统解决方案',
    slug: 'rfid-vehicle-positioning-speed',
    categorySlug: 'asset-inspection',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '传统 GPS 车辆定位存在盲点、占用通信资源多且成本高，基于 RFID 的智能车辆定位及测速系统可解决此问题。系统以存车辆信息的孚恩超高频电子标签为智能车牌，通过多基站 TDOA 定位、多普勒频移测速，无定位盲点。',
    content: '随着经济和汽车技术的发展，现在拥有汽车的居民越来越多，堵车现象也越来越严重。如何充分利用路网、缩短车辆运行时间、降低行车延误、保障行车安全、提高道路通行能力等道路资源优化问题成为当前每个城市需要解决的重要课题。\n\n目前的车辆定位系统中，典型的车辆位置信息获取方法主要是基于 GPS 全球定位系统。这种由被定位物体主动发送位置信息的方法具有占用通信资源多、系统运行成本高的缺点，并且在城市高楼区、高架桥下、林荫道及隧道内，可能会出现暂时的定位盲点。\n\n该系统主要由装有 RFID 智能车牌的车辆、数据无线收发节点、CDMA 模块、GIA 系统、数据处理单元、数据处理及控制中心组成。每一个 RFID 车牌都存储了该车辆的车牌号、车辆用途、最大载货量、车主姓名及身份证号等信息。基于多基站无线定位的方法是由无线数据收发节点主动获取车辆位置信息，利用接受信号强度（RSSI）、到达时间（TOA）、到达时间差（TDOA）定位。',
  },
  {
    name: '基于 RFID 技术的电网资产全寿命周期管理解决方案',
    slug: 'rfid-power-grid-asset-lifecycle',
    categorySlug: 'asset-inspection',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '为解决电网资产数据质量下降、账卡物难一致问题，上海孚恩推出 RFID 电网资产全寿命周期管理方案。方案用 UT503 超高频抗金属标签（IP65 防护、读距 8 米）和 M11 工业级手持终端，集成 PMS、SAP 系统，实现资产动态跟踪。',
    content: '近年来，电网公司对电网资产全寿命周期管理提出了具体的管理要求，不少电网公司积极开展了存量资产 PMS、PM 与 AM 数据间的联动对应，但依旧存在着因资产变动造成数据质量下降的问题。\n\n通过建立设备实物标识系统，集成资产实物流、信息流、价值流，实现账、卡、物永续联动一致，实现资产管理各阶段的信息共享。\n\n本方案综合了 RFID 技术、网络技术、计算机技术、数据库技术和无线通讯技术。实现对 RFID 设备的管理，实现与 PMS、SAP 等系统的数据交换和账、卡、物相符数据的比对、分析，生成各种管理报表；实现与 RFID 手持终端业务数据的上传与下载，实现对实物标识的日常动态管理。',
  },
  // 智能智造 (smart-manufacturing) — additional 3 applications
  {
    name: '基于 RFID 技术的汽车制造工业系统解决方案',
    slug: 'rfid-auto-manufacturing-system',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '汽车行业存在信息化不均、信息孤岛问题，亟需提升物流效率、降低差错。基于 RFID 技术的方案可满足需求，其无接触识别、耐恶劣环境等优势，能覆盖车体跟踪（滑橇贴标签随流程）、零部件管理（硬 / 软链接跟踪）、整车物流及供应链全环节。',
    content: '目前汽车行业信息化程度良莠不齐，有些信息化程度很高，有些则刚刚处于起步状态，有些甚至仍然沿用完全手工操作记录的方式。但所有企业都希望能够建立识别系统来帮助整个企业的管理提升到一定的水平。\n\nRFID（无线射频识别）是近年来迅速发展的一种快速识别技术，通过对被识别物体的无接触识别获取资料信息，与传统条形码技术相比，具有数据容量大、无接触识别、保存时间长、耐污适应恶劣环境等特点。\n\nRFID 在汽车工业系统中的应用主要包括车体识别与跟踪管理、零部件与固定资产的跟踪管理、整车的物流管理等方面。采用 RFID 系统后，电子标签一般被放在载有车体的滑橇上，自始至终随工件运行，形成了一个随车体移动的数据，成为在整个生产流程中随身携带数据库的 "智能车体"。',
  },
  {
    name: '2022 非标自动化生产检测线 RFID 成功案例',
    slug: 'rfid-motor-production-line',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '工业级读写器 D1606 与 UT712 电子标签解决方案，专为高效电机、防爆电机生产线设计。采用 RFID 技术实时追踪生产检测信息，自动化记录工序状态，提升检测准确性和效率。适用于风机、水泵、煤矿等领域。',
    content: '目前，生产制造业的自动化水平逐渐提升，集中控制程度越来越密集，作为管理层，需要实时了解生产运行的状态。传统的以人为主的控制系统很难完成繁琐的任务，以 RFID 技术为核心的数据采集，为生产制造商提供了方便。\n\n案例客户是一家专业生产高效电机、防爆电机的企业。公司主要产品有 YE3 系列高效电机、YBX3 隔爆型电机、YFB3 粉尘防爆型电机、YBBP 隔爆型变频调速电机等产品，广泛应用于风机、水泵、煤矿、化工等领域。目前项目成功将 RFID 工业读头应用在非标自动化检测线上。\n\n本次推出的工业级读写器能够实时的对产品进行识别以及检测信息记录，在产线和检测工位上安装读写器，载具托盘上安装 RFID 电子标签，产品流转到固定检测工位上时，读取标签内的数据，确认是否已经完成到上一道工序检测，确认 OK 后流转到下一道检测工位。',
  },
  {
    name: '光伏拉晶厂 RFID 生产工序管理成功案例',
    slug: 'rfid-solar-crystal-pulling-factory',
    categorySlug: 'smart-manufacturing',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '光伏行业 RFID 智能解决方案，提升单晶硅生产效率与良品率。采用 D1604R 工业读写器和 UT712 电子标签，实现拉晶工艺全流程数据采集与 MES 系统集成。解决离散制造数据追踪难题，优化截断、开方、磨倒工序管理。',
    content: '随着全球能源短缺，面对全球气候变暖，清洁能源已成为国内能源的主要发展目标，而光伏行业作为清洁能源中重要的一环，在历经十几年的发展，已成为我国的国际化战略性新兴产业。\n\n由于光伏产业的整体生产工艺流程较为复杂，因此需要采取可靠智能的 RFID 解决方案，实现高效运行。本项目成功案例是云南某光伏拉晶厂，拉晶车间按工艺来说主要有以下工艺：出晶工艺——截断工艺——开方工艺——磨倒工艺。\n\nRFID 工业读头在生产自动线上的数据采集是从截断机开始，当截断机切断硅棒后，机械臂夹把硅棒放到托盘上进行首次数据写入，将硅棒信息和托盘信息进行绑定。在后面的自动化线上，每道工序都有 RFID 读头进行数据采集，最后一道工序下线解绑。\n\nRFID 产品的应用为客户的 MES 系统实时提供托盘信息统计数据，能够对整个工艺流程中的单晶硅片进行追踪把控，实现了生产车间工艺流程的智能化、可视化、透明化。',
  },
  // 智能柜体 (smart-cabinet) — 1 application
  {
    name: '武汉楚天威豹金融押运系统',
    slug: 'wuhan-chutian-weibao-finance-escort',
    categorySlug: 'smart-cabinet',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: '武汉楚天威豹金融服务有限公司结合 RFID（含 RFID 钱箱标签、UHF 门型通道）、指纹识别、GPS 定位等技术，大幅提升款箱出入库效率，实现人 / 车 / 枪 / 款箱精细化管理。',
    content: '武汉楚天威豹金融服务有限公司由深圳市威豹金融押运股份有限公司和武汉市融威押运保安服务有限公司共同出资设立。公司注册资金达 1000 万元人民币，已取得经营资质的业务包括尾箱寄库；现金清分、清点；自助设备加钞和维护；现金金库托管等金融业务相关配套服务。\n\n通过实施本金融押运系统，采用信息化的辅助手段结合相关制度，通过电子身份识别（指纹、身份识别卡、电子相片）、电子款箱识别（RFID 电子标签）、金库 RFID 快速出入库扫描，车辆及款箱 GPS 定位，无线监控报警等技术，实现信息网络化及智能化管理。\n\n项目实施内容包括：人员及款箱标识与身份标签卡的安全制作、手持终端领用和交回的安全控制、银行系统内款箱交接的安全识别和交接控制、金库内款箱的快速出入库、枪支物品自动管理。\n\n用户收益：金库的款箱出入库效率大大提高；任务调度和状态查询实时更新；对人员、枪支、车辆、款箱、物品等各个方面精细化管理；银行更放心将押运业务外包。',
  },
  {
    name: 'RFID 技术在无人新零售中的应用',
    slug: 'rfid-unmanned-retail',
    categorySlug: 'retail-supply-chain',
    image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ktje.png',
    description: 'AmazonGo 带火 "即拿即走" 无人商店后，国内借新零售与移动支付优势，无人店及售货机快速兴起。上海孚恩提供高频（ISO15693）与超高频（ISO18000-6C）两种方案，用户扫码开无人售货机柜门，取贴有 RFID 标签的商品，关柜即自动结算。',
    content: '亚马逊 2016 年推出的 AmazonGo 无人商店，其 "即拿即走，免排队" 的超前购物体验一经发布便广受业界瞩目，一时之间，无人商店俨然成为全球零售业的一种新趋势。\n\n国内现有的无人便利店购物流程较为简单，首先顾客进入商店需要扫描二维码（微信或支付宝）。用户在商店内选好商品后，需将商品整齐放置于收银台检测区，然后，检测台边上的显示屏会自动显示一个收费二维码，用户可以利用微信或者支付宝扫描二维码即可完成付账。\n\n无人自助售货机可以实现开门自取，即拿即走，每个层格使用 RFID 天线代替，每个商品上贴一个 RFID 电子标签，实现自动读取。下载应用程序 APP，实名注册，结合蚂蚁信用，扫描售货机上二维码，自动开锁，顾客可以取走自己需要购买的商品，再关闭柜门，后台自动结算扣费。',
  },
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

  async sync(ctx) {
    const { locale } = ctx.query;
    const targetLocale = locale || 'en';

    const results: { categories: number; applications: number; deleted: number; errors: string[] } = {
      categories: 0,
      applications: 0,
      deleted: 0,
      errors: [],
    };

    // Step 1: Delete ALL existing applications (all locales)
    const existingApps = await strapi.db.query('api::application.application').findMany({});

    for (const app of existingApps) {
      try {
        await strapi.db.query('api::application.application').delete({ where: { id: app.id } });
        results.deleted++;
      } catch (err: any) {
        results.errors.push(`Delete app failed: ${app.name} - ${err.message}`);
      }
    }

    // Step 2: Delete ALL existing categories (all locales)
    const existingCats = await strapi.db.query('api::application-category.application-category').findMany({});

    for (const cat of existingCats) {
      try {
        await strapi.db.query('api::application-category.application-category').delete({ where: { id: cat.id } });
        results.deleted++;
      } catch (err: any) {
        results.errors.push(`Delete category failed: ${cat.name} - ${err.message}`);
      }
    }

    // Step 3: Create categories (published)
    const categoryMap: Record<string, any> = {};

    for (const cat of APP_CATEGORIES) {
      try {
        const created = await strapi.documents('api::application-category.application-category').create({
          data: {
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            description: cat.description,
            sortOrder: cat.sortOrder,
          },
          status: 'published',
          locale: targetLocale as 'en' | 'zh',
        });
        categoryMap[cat.slug] = created;
        results.categories++;
      } catch (err: any) {
        results.errors.push(`Category create failed: ${cat.name} - ${err.message}`);
      }
    }

    // Step 4: Create applications from source data
    for (const app of APPLICATIONS) {
      try {
        const cat = categoryMap[app.categorySlug];
        await strapi.documents('api::application.application').create({
          data: {
            name: app.name,
            slug: app.slug,
            description: app.description,
            useCase: app.content,
            category: cat?.id || null,
          },
          status: 'published',
          locale: targetLocale as 'en' | 'zh',
        });
        results.applications++;
      } catch (err: any) {
        results.errors.push(`Application create failed: ${app.name} - ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    return { data: results };
  },

  async findBySlug(ctx) {
    const { slug } = ctx.params;
    const { locale } = ctx.query;

    const entity = await strapi.db.query('api::application-category.application-category').findOne({
      where: { slug, locale: locale || 'en', publishedAt: { $notNull: true } },
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
