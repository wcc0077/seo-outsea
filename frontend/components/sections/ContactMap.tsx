interface OfficeLocation {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  lat: number;
  lng: number;
  isHQ?: boolean;
}

interface MapEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
}

function MapEmbed({ lat, lng, zoom = 14, height = '300px' }: MapEmbedProps) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.005}%2C${lng + 0.01}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      <iframe
        title="Office location map"
        src={src}
        className="w-full"
        style={{ height, border: 'none' }}
        loading="lazy"
      />
    </div>
  );
}

function OfficeCard({ office }: { office: OfficeLocation }) {
  return (
    <div className={`rounded-2xl p-6 ${office.isHQ ? 'bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200' : 'bg-white border border-neutral-200'}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${office.isHQ ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-neutral-900">{office.name}</h3>
          {office.isHQ && (
            <span className="inline-block text-xs font-medium bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mt-1">
              Headquarters
            </span>
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm text-neutral-600 mb-4">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{office.address}</span>
        </div>
        {office.phone && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${office.phone}`} className="text-primary-600 hover:text-primary-700">{office.phone}</a>
          </div>
        )}
        {office.email && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${office.email}`} className="text-primary-600 hover:text-primary-700">{office.email}</a>
          </div>
        )}
      </div>
      <MapEmbed lat={office.lat} lng={office.lng} />
    </div>
  );
}

const OFFICES: OfficeLocation[] = [
  {
    name: 'Shanghai Headquarters',
    address: '上海市闵行区元江路5500号',
    phone: '+86-21-5446-0828',
    email: 'info@fn-tech.com',
    lat: 31.0300,
    lng: 121.3500,
    isHQ: true,
  },
];

export default function ContactMap() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">Our Offices</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Visit us at our headquarters and branch offices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OFFICES.map((office) => (
            <OfficeCard key={office.name} office={office} />
          ))}
        </div>
      </div>
    </section>
  );
}
