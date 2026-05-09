interface ClientLogosProps {
  title?: string;
}

const CLIENT_LOGOS = [
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link1.jpg', alt: 'TCL王牌' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link3.jpg', alt: '北大荒集团' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link2.jpg', alt: '海尔集团' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link4.jpg', alt: '海曼机器人' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link6.jpg', alt: 'ROBAM老板' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link5.jpg', alt: '鲁泰纺织' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link7.jpg', alt: '中华人民共和国商务部' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link8.jpg', alt: '通威新能源' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link9.jpg', alt: '正邦集团' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link10.jpg', alt: '中国神华' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link12.jpg', alt: '中国航天' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link11.jpg', alt: '中国烟草' },
  { src: 'https://pmtdb1c40-pic17.websiteonline.cn/upload/link13.jpg', alt: '中国银行' },
];

// Duplicate set for seamless infinite scroll
const SCROLL_LOGOS = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

export default function ClientLogos({ title }: ClientLogosProps) {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}

        {/* Infinite scroll marquee */}
        <div className="overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-8 animate-marquee"
            style={{ width: 'max-content' }}
          >
            {SCROLL_LOGOS.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[142px] h-[80px] flex items-center justify-center rounded-lg bg-white border border-neutral-200 hover:border-primary-300 transition-colors duration-200"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-[120px] max-h-[60px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
