import { getTranslations } from 'next-intl/server';
import { getPageBySlug, getAboutPageBySlug } from '@/lib/strapi';
import GenericPage from '@/components/sections/GenericPage';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  milestone: string;
}

export default async function AboutHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Progressive migration: try Strapi page first, fall back to hardcoded content
  const page = await getPageBySlug('about-history', locale).catch(() => null);
  if (page) {
    return <GenericPage params={Promise.resolve({ locale })} slug="about-history" />;
  }

  const strapiData = await getAboutPageBySlug('company-history', locale);
  const isZh = locale === 'zh';

  const heroTitle = strapiData?.title || (isZh ? '发展历程' : 'Development History');
  const heroSubtitle = isZh
    ? '从2006年起步，孚恩电子深耕RFID行业近二十年'
    : 'Since 2006, FN Tech has been deeply cultivating the RFID industry for nearly 20 years';

  const timeline: TimelineEvent[] = isZh
    ? [
        {
          year: '2006',
          title: '公司成立',
          description: '上海孚恩电子科技有限公司在上海闵行区国家863软件孵化器基地正式注册成立，成为国内最早从事RFID技术研发的企业之一。',
          milestone: isZh ? '创立' : 'Founded',
        },
        {
          year: '2008',
          title: '首款RFID读写器问世',
          description: '成功研发出第一款工业级RFID读写器，标志着公司在RFID硬件领域取得突破。',
          milestone: isZh ? '产品突破' : 'Product Breakthrough',
        },
        {
          year: '2010',
          title: '双软认证',
          description: '获得"上海市双软认证企业"认定，软件开发能力得到官方认可。',
          milestone: isZh ? '资质认证' : 'Certification',
        },
        {
          year: '2012',
          title: '高新技术企业认定',
          description: '被认定为"上海市高新技术企业"，研发实力和技术创新能力获得权威认可。',
          milestone: isZh ? '高新技术企业' : 'Hi-Tech Enterprise',
        },
        {
          year: '2014',
          title: '手持终端产品线拓展',
          description: '推出工业级手持终端系列，实现从固定式读写器到移动终端的产品线扩展。',
          milestone: isZh ? '产品扩展' : 'Product Expansion',
        },
        {
          year: '2016',
          title: '知识产权突破',
          description: '累计获得30余项知识产权，涵盖RFID天线设计、读写器核心算法等领域。',
          milestone: isZh ? '知识产权' : 'IP Milestone',
        },
        {
          year: '2018',
          title: '科技小巨人培育企业',
          description: '被评为"上海市科技小巨人培育企业"，创新能力和发展潜力获得认可。',
          milestone: isZh ? '科技小巨人' : 'Sci-Tech Giant',
        },
        {
          year: '2020',
          title: 'UHF产品线全面升级',
          description: '推出新一代超高频RFID读写器系列产品，性能达到国际先进水平。',
          milestone: isZh ? '技术升级' : 'Tech Upgrade',
        },
        {
          year: '2022',
          title: '专精特新中小企业',
          description: '获评"专精特新中小企业"，在细分领域的专业能力和市场地位得到认可。',
          milestone: isZh ? '专精特新' : 'Specialized & Innovative',
        },
        {
          year: '2024',
          title: '全球化布局加速',
          description: '产品线覆盖HF/UHF全频段，应用于智能制造、物流、档案、零售等多个行业，服务全球客户。',
          milestone: isZh ? '全球服务' : 'Global Service',
        },
      ]
    : [
        {
          year: '2006',
          title: 'Company Founded',
          description: 'Shanghai Fuen Electronic Technology Co., Ltd. was officially registered and established in the National 863 Software Incubator Base, Minhang District, Shanghai, becoming one of the earliest enterprises engaged in RFID technology R&D in China.',
          milestone: 'Founded',
        },
        {
          year: '2008',
          title: 'First RFID Reader Launched',
          description: 'Successfully developed the first industrial-grade RFID reader, marking a breakthrough in the RFID hardware field.',
          milestone: 'Product Breakthrough',
        },
        {
          year: '2010',
          title: 'Double-Software Certification',
          description: 'Obtained "Shanghai Double-Software Certified Enterprise" recognition, with software development capabilities officially recognized.',
          milestone: 'Certification',
        },
        {
          year: '2012',
          title: 'High-Tech Enterprise',
          description: 'Recognized as "Shanghai High-Tech Enterprise", with R&D strength and technical innovation capabilities receiving authoritative recognition.',
          milestone: 'Hi-Tech Enterprise',
        },
        {
          year: '2014',
          title: 'Handheld Terminal Line',
          description: 'Launched industrial-grade handheld terminal series, expanding from fixed readers to mobile terminals.',
          milestone: 'Product Expansion',
        },
        {
          year: '2016',
          title: 'IP Portfolio Growth',
          description: 'Accumulated over 30 intellectual property rights, covering RFID antenna design, reader core algorithms, and more.',
          milestone: 'IP Milestone',
        },
        {
          year: '2018',
          title: 'Sci-Tech Giant Cultivation',
          description: 'Rated as "Shanghai Sci-Tech Giant Cultivation Enterprise", with innovation capability and development potential recognized.',
          milestone: 'Sci-Tech Giant',
        },
        {
          year: '2020',
          title: 'UHF Product Upgrade',
          description: 'Launched new generation UHF RFID reader series, with performance reaching international advanced level.',
          milestone: 'Tech Upgrade',
        },
        {
          year: '2022',
          title: 'Specialized & Innovative SME',
          description: 'Awarded "Specialized, Refined, Unique and Innovative SME", recognized for professional capabilities and market position in niche segments.',
          milestone: 'Specialized & Innovative',
        },
        {
          year: '2024',
          title: 'Global Expansion',
          description: 'Product line covers HF/UHF full frequency bands, applied in smart manufacturing, logistics, archives, retail and other industries, serving global customers.',
          milestone: 'Global Service',
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
        { label: isZh ? '发展历程' : 'Development History' },
      ]} />

      {/* Timeline */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-700/50" aria-hidden="true" />

            {timeline.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-start mb-12 last:mb-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary-400 border-4 border-neutral-900 z-10 -translate-x-1.5 md:-translate-x-1.5" />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="p-6 rounded-xl bg-neutral-800/50 border border-neutral-700/30 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-3 py-1 text-sm font-bold text-primary-400 bg-primary-500/10 rounded-full border border-primary-500/20">
                          {event.year}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          {event.milestone}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">{event.description}</p>
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
