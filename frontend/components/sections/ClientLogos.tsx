import Image from 'next/image';
import { ClientData } from '@/lib/strapi';

interface ClientLogosProps {
  title?: string;
  clients?: ClientData[];
}

export default function ClientLogos({ title, clients = [] }: ClientLogosProps) {
  if (clients.length === 0) return null;

  const scrollLogos = [...clients, ...clients];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-8 animate-marquee"
            style={{ width: 'max-content' }}
          >
            {scrollLogos.map((client, index) => (
              <div
                key={`${client.documentId || client.name}-${index}`}
                className="flex-shrink-0 w-[142px] h-[80px] flex items-center justify-center rounded-lg bg-white border border-neutral-200 hover:border-primary-300 transition-colors duration-200"
              >
                <Image
                  src={client.logo.url}
                  alt={client.name}
                  className="max-w-[120px] max-h-[60px] object-contain"
                  width={120}
                  height={60}
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
