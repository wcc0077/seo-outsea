import { StatData } from '@/lib/strapi';

interface CompanyStatsProps {
  title?: string;
  subtitle?: string;
  stats?: StatData[];
}

export default function CompanyStats({ title, subtitle, stats }: CompanyStatsProps) {
  const displayStats = stats || [];

  if (displayStats.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2b5e 0%, #1a4a8a 50%, #0f2b5e 100%)' }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="flex items-center gap-4 mb-20">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayStats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center mb-5">
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 30px rgba(240,165,0,.15)' }} />
                <div
                  className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-105"
                  style={{
                    border: '3px solid #f0a500',
                    background: 'rgba(240,165,0,.05)',
                  }}
                />
                <span className="relative text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
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
