interface StatsSectionProps {
  title?: string;
  stats?: Array<{ value: string; label: string }>;
}

export default function StatsSection({ title, stats }: StatsSectionProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* RF wave pattern background */}
      <div className="absolute inset-0 bg-rf-waves opacity-30" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-14">
            <div className="w-12 h-0.5 bg-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 stagger-children">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl font-bold mb-3 font-display text-white">{stat.value}</div>
              <div className="text-primary-400/80 text-sm font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
