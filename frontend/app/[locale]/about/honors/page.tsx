import { getTranslations } from 'next-intl/server';
import { getAboutPageBySlug } from '@/lib/strapi';
import CertificateGallery from '@/components/sections/CertificateGallery';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface HonorItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
}

export default async function AboutHonorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const strapiData = await getAboutPageBySlug('company-honors', locale);
  const isZh = locale === 'zh';

  const heroTitle = strapiData?.title || (isZh ? '荣誉资质' : 'Honors & Certifications');
  const heroSubtitle = isZh
    ? '权威认可，见证孚恩电子的专业与实力'
    : 'Authoritative recognition, witnessing FN Tech\'s professionalism and strength';

  // Certificate images extracted from fn-tech.com/qualification.html
  const certificateImages = [
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p6.jpg', alt: isZh ? '高新技术企业证书' : 'High-Tech Enterprise Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/cv5p.png', alt: isZh ? 'ISO9001 质量管理体系认证' : 'ISO9001 Quality Management System' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p8.jpg', alt: isZh ? 'ISO14001 环境管理体系认证' : 'ISO14001 Environmental Management System' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p9.jpg', alt: isZh ? 'CCC 强制认证' : 'CCC Mandatory Certification' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p10.jpg', alt: isZh ? '专精特新中小企业' : 'Specialized & Innovative SME' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p1.jpg', alt: isZh ? '科技小巨人培育企业' : 'Sci-Tech Giant Cultivation Enterprise' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p2.jpg', alt: isZh ? '双软认证企业' : 'Double-Software Certified Enterprise' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p3.jpg', alt: isZh ? '知识产权证书' : 'Intellectual Property Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p11.jpg', alt: isZh ? '质量管理体系认证' : 'Quality Management System Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p12.jpg', alt: isZh ? '环境管理体系认证' : 'Environmental Management System Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p13.jpg', alt: isZh ? '产品认证证书' : 'Product Certification Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/1234.png', alt: isZh ? '企业认证资质' : 'Enterprise Qualification Certificate' },
    { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/p4.jpg', alt: isZh ? '行业准入证书' : 'Industry Access Certificate' },
  ];

  const honorCategories = isZh
    ? [
        { label: '企业资质', en: 'Enterprise Qualifications' },
        { label: '体系认证', en: 'System Certifications' },
        { label: '知识产权', en: 'Intellectual Property' },
      ]
    : [
        { label: 'Enterprise Qualifications', en: '' },
        { label: 'System Certifications', en: '' },
        { label: 'Intellectual Property', en: '' },
      ];

  const honors: HonorItem[][] = isZh
    ? [
        // Enterprise qualifications
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ),
            title: '上海市高新技术企业',
            description: '经上海市科学技术委员会、财政局、国家税务局和地方税务局联合认定，具备持续研发创新能力和核心技术。',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.999 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.614.428-3.127 1.177-4.433" />
              </svg>
            ),
            title: '专精特新中小企业',
            description: '在RFID细分领域具备专业化、精细化、特色化、新颖化发展特征，获得市级专精特新认定。',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            title: '上海市科技小巨人培育企业',
            description: '具备较强科技创新能力和发展潜力，被认定为上海市科技小巨人培育企业。',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            ),
            title: '上海市双软认证企业',
            description: '软件产品和软件企业双重认证，软件开发能力和产品质量获得官方认可。',
            category: honorCategories[0].label,
          },
        ],
        // System certifications
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: 'ISO9001 质量管理体系',
            description: '通过ISO9001质量管理体系认证，建立标准化的质量管理流程，确保产品品质稳定可靠。',
            category: honorCategories[1].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 00-.153-1.608l-1.1-1.1" />
              </svg>
            ),
            title: 'ISO14001 环境管理体系',
            description: '通过ISO14001环境管理体系认证，践行绿色环保理念，实现可持续发展。',
            category: honorCategories[1].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.143 14.766A7.5 7.5 0 014.5 10.5a7.468 7.468 0 012.636-5.713m8.52 14.49a7.49 7.49 0 01-6.22-.756M15.656 19.5a7.476 7.476 0 01-4.017-1.59m-3.704 1.59A7.476 7.476 0 013.84 15.5c0-1.243.302-2.414.836-3.444" />
              </svg>
            ),
            title: 'CCC 强制认证',
            description: '产品通过中国强制性产品认证（CCC），符合国家电气安全和电磁兼容标准。',
            category: honorCategories[1].label,
          },
        ],
        // Intellectual property
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ),
            title: '70+ 项知识产权',
            description: '累计获得70余项专利和软件著作权，涵盖RFID天线设计、读写器核心算法、中间件平台等关键技术领域。',
            category: honorCategories[2].label,
          },
        ],
      ]
    : [
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ),
            title: 'Shanghai High-Tech Enterprise',
            description: 'Jointly recognized by Shanghai Science and Technology Commission, Finance Bureau, and Tax Bureau, with continuous R&D innovation capability and core technology.',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.999 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.614.428-3.127 1.177-4.433" />
              </svg>
            ),
            title: 'Specialized & Innovative SME',
            description: 'Demonstrates specialized, refined, distinctive, and innovative development characteristics in the RFID niche segment, receiving municipal-level recognition.',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            ),
            title: 'Shanghai Sci-Tech Giant Cultivation',
            description: 'Possesses strong scientific innovation capability and development potential, recognized as Shanghai Sci-Tech Giant Cultivation Enterprise.',
            category: honorCategories[0].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            ),
            title: 'Shanghai Double-Software Certified',
            description: 'Dual certification for software products and software enterprise, with software development capability and product quality officially recognized.',
            category: honorCategories[0].label,
          },
        ],
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ),
            title: 'ISO9001 Quality Management',
            description: 'Certified with ISO9001 Quality Management System, establishing standardized quality management processes to ensure stable and reliable product quality.',
            category: honorCategories[1].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 00-.153-1.608l-1.1-1.1" />
              </svg>
            ),
            title: 'ISO14001 Environmental Management',
            description: 'Certified with ISO14001 Environmental Management System, practicing green environmental concepts and achieving sustainable development.',
            category: honorCategories[1].label,
          },
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.143 14.766A7.5 7.5 0 014.5 10.5a7.468 7.468 0 012.636-5.713m8.52 14.49a7.476 7.476 0 01-4.017-1.59m-3.704 1.59A7.476 7.476 0 013.84 15.5c0-1.243.302-2.414.836-3.444" />
              </svg>
            ),
            title: 'CCC Mandatory Certification',
            description: 'Products pass China Compulsory Certification (CCC), meeting national electrical safety and electromagnetic compatibility standards.',
            category: honorCategories[1].label,
          },
        ],
        [
          {
            icon: (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            ),
            title: '70+ Intellectual Property Rights',
            description: 'Accumulated over 70 patents and software copyrights, covering key technical areas including RFID antenna design, reader core algorithms, and middleware platforms.',
            category: honorCategories[2].label,
          },
        ],
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
        { label: isZh ? '荣誉资质' : 'Honors & Certifications' },
      ]} />

      <CertificateGallery
        images={certificateImages}
        title={isZh ? '资质证书' : 'Qualification Certificates'}
        titleEn={isZh ? '证书墙' : 'CERTIFICATE GALLERY'}
      />

      {/* Honors sections */}
      {honors.map((group, groupIdx) => (
        <section key={groupIdx} className={`py-20 ${groupIdx % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-950'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
                {honorCategories[groupIdx].label}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {honorCategories[groupIdx].label}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.map((honor, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-xl bg-neutral-800/40 border border-neutral-700/30 hover:border-primary-500/30 transition-colors">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                    {honor.icon}
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                      {honor.category}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">{honor.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{honor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
