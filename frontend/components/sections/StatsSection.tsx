interface StatsSectionProps {
  title?: string;
  stats?: Array<{ value: string; label: string }>;
}

export default function StatsSection({ title, stats }: StatsSectionProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-16 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-primary-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
