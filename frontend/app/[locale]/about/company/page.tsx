import { getTranslations } from 'next-intl/server';
import { getAboutPageBySlug } from '@/lib/strapi';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default async function AboutCompanyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const strapiData = await getAboutPageBySlug('company-scenery', locale);
  const isZh = locale === 'zh';

  const heroTitle = strapiData?.title || (isZh ? '公司实景' : 'Company Facility');
  const heroSubtitle = isZh
    ? '走进孚恩电子——现代化的研发与生产基地'
    : 'Step into FN Tech — a modern R&D and production base';

  const facilities = isZh
    ? [
        {
          title: '研发大楼',
          description: '坐落于漕河泾浦江高科技园国家863软件孵化器基地，拥有独立的研发办公区域。',
          area: isZh ? '研发办公区' : 'R&D Office Area',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_0cw9.jpg',
        },
        {
          title: '研发中心',
          description: '配备专业的RFID测试实验室、电磁兼容测试室和可靠性验证设备。',
          area: isZh ? '实验室' : 'Testing Lab',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png',
        },
        {
          title: '生产车间',
          description: '标准化SMT贴片线、组装线和老化测试区，确保产品品质。',
          area: isZh ? '生产线' : 'Production Line',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp',
        },
        {
          title: '产品展示厅',
          description: '全方位展示公司RFID产品线和行业解决方案。',
          area: isZh ? '展示厅' : 'Showroom',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_5oov_u61r.jpg',
        },
        {
          title: '仓储物流中心',
          description: '完善的仓储管理和物流配送体系，保障全球客户的供货需求。',
          area: isZh ? '仓储中心' : 'Warehouse',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458614250_kwa3.jpg',
        },
        {
          title: '员工活动中心',
          description: '为员工提供舒适的休息和娱乐空间，营造积极向上的企业文化。',
          area: isZh ? '活动中心' : 'Activity Center',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg',
        },
      ]
    : [
        {
          title: 'R&D Building',
          description: 'Located in Caohejing Pujiang Hi-Tech Park, National 863 Software Incubator Base, with independent R&D office area.',
          area: 'R&D Office',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_0cw9.jpg',
        },
        {
          title: 'R&D Center',
          description: 'Equipped with professional RFID testing lab, EMC testing room, and reliability verification equipment.',
          area: 'Testing Lab',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_ehv8.png',
        },
        {
          title: 'Production Workshop',
          description: 'Standardized SMT assembly line, assembly line, and burn-in testing area to ensure product quality.',
          area: 'Production Line',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/5.webp',
        },
        {
          title: 'Product Showroom',
          description: 'Comprehensive display of company RFID product lines and industry solutions.',
          area: 'Showroom',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_5oov_u61r.jpg',
        },
        {
          title: 'Warehouse & Logistics',
          description: 'Complete warehouse management and logistics distribution system to ensure global supply.',
          area: 'Warehouse',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1458614250_kwa3.jpg',
        },
        {
          title: 'Employee Activity Center',
          description: 'Comfortable rest and recreation space for employees, fostering a positive corporate culture.',
          area: 'Activity Center',
          image: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1_dfym_3f0c.jpg',
        },
      ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-primary-500/10" />
            <div className="absolute inset-12 rounded-full border border-primary-500/8" />
            <div className="absolute inset-24 rounded-full border border-primary-500/5" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-5">{heroTitle}</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">{heroSubtitle}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-neutral-900 to-transparent" aria-hidden="true" />
      </section>

      <Breadcrumb locale={locale} items={[
        { label: isZh ? '关于孚恩' : 'About' },
        { label: isZh ? '公司实景' : 'Company Facility' },
      ]} />

      {/* Facility overview */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
              {isZh ? '基地概览' : 'FACILITY OVERVIEW'}
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isZh ? '3000+ 平方米研发生产基地' : '3,000+ sqm R&D and Production Base'}
            </h2>
            <p className="mt-4 text-neutral-400 max-w-3xl leading-relaxed">
              {isZh
                ? '公司坐落于上海市闵行区漕河泾浦江高科技园，拥有独立的研发办公区、标准化生产车间、RFID测试实验室和产品展示厅，形成完整的研发-生产-展示一体化基地。'
                : 'Located in Caohejing Pujiang Hi-Tech Park, Minhang District, Shanghai, the company has an independent R&D office area, standardized production workshop, RFID testing laboratory, and product showroom, forming a complete R&D-production-exhibition integrated base.'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '3000+', label: isZh ? '平方米' : 'sqm' },
              { value: '6', label: isZh ? '功能区域' : 'Functional Areas' },
              { value: '15+', label: isZh ? '测试设备' : 'Testing Equipment' },
              { value: '24h', label: isZh ? '老化测试' : 'Burn-in Testing' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-neutral-800/50 border border-neutral-700/30">
                <div className="text-3xl font-bold text-primary-400 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Facility cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, i) => (
              <div key={i} className="group rounded-xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/30 transition-all duration-300">
                <div className="aspect-[16/10] bg-neutral-800 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
                      {facility.area}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{facility.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
