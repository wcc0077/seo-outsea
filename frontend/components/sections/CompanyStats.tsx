interface CompanyStatsProps {
  title?: string;
  subtitle?: string;
}

const STATS = [
  { value: '19+', label: '年RFID专业经验' },
  { value: 'N+', label: '各地办事处' },
  { value: '20+', label: '项国省市级资质荣誉' },
  { value: '80+', label: '项自主知识产权' },
  { value: '2000+', label: '万注册资金' },
  { value: '4000+', label: '平米研发生产基地' },
  { value: '100+', label: '人专业团队' },
  { value: '5000+', label: '家B端客户' },
];

export default function CompanyStats({ title, subtitle }: CompanyStatsProps) {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2b5e 0%, #1a4a8a 50%, #0f2b5e 100%)' }}>
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Soft glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─ Section Header ── */}
        {title && (
          <div className="flex items-center gap-4 mb-20">
            {/* Geometric shape: blue parallelogram + yellow accent */}
            <div className="flex items-center -space-x-3">
              <div className="w-16 h-14 -skew-x-12 rounded" style={{ background: '#1a3d7a', boxShadow: 'inset 0 0 20px rgba(0,0,0,.3)' }} />
              <div className="w-6 h-14 -skew-x-12 rounded" style={{ background: '#f0a500', boxShadow: '0 0 20px rgba(240,165,0,.3)' }} />
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">{title}</h2>
              {subtitle && (
                <span className="text-sm font-light text-blue-200/60 tracking-widest uppercase hidden sm:inline">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {STATS.map((stat, index) => (
            <div key={index} className="flex flex-col items-center group">
              {/* Circle with golden ring */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center mb-5">
                {/* Outer ring glow */}
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 30px rgba(240,165,0,.15)' }} />
                {/* Golden ring */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105"
                  style={{
                    border: '3px solid #f0a500',
                    background: 'rgba(240,165,0,.05)',
                  }}
                />
                {/* Value text */}
                <span className="relative text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
              {/* Label */}
              <p className="text-center text-blue-100/70 text-sm font-medium tracking-wide max-w-[160px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
