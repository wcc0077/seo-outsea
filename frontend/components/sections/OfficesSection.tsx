'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { OfficeData } from '@/lib/strapi';

interface MapConfig {
  centerLat: number;
  centerLng: number;
  zoom: number;
}

interface OfficesSectionProps {
  locale: string;
  title?: string;
  offices: OfficeData[];
  mapConfig: MapConfig;
}

function HQMarker({ office }: { office: OfficeData }) {
  const markerRef = useRef<L.CircleMarker>(null);

  useEffect(() => {
    markerRef.current?.openPopup();
  }, []);

  return (
    <CircleMarker
      ref={markerRef}
      center={[office.lat, office.lng]}
      radius={10}
      pathOptions={{
        fillColor: '#0891b2',
        color: '#ffffff',
        weight: 2.5,
        fillOpacity: 1,
      }}
    >
      <Popup>
        <div className="text-sm">
          <strong className="text-primary-700">{office.name}</strong>
          <br />
          <span className="text-neutral-600">{office.address}</span>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function LeafletMap({ offices, mapConfig }: { offices: OfficeData[]; mapConfig: MapConfig }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      <MapContainer
        center={[mapConfig.centerLat, mapConfig.centerLng]}
        zoom={mapConfig.zoom}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {offices.map((office) => {
          const key = office.documentId || office.name;
          return office.isHQ ? (
            <HQMarker key={key} office={office} />
          ) : (
            <CircleMarker
              key={key}
              center={[office.lat, office.lng]}
              radius={7}
              pathOptions={{
                fillColor: '#06b6d4',
                color: '#ffffff',
                weight: 2.5,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-primary-700">{office.name}</strong>
                  <br />
                  <span className="text-neutral-600">{office.address}</span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function HQCard({ office }: { office: OfficeData }) {
  const t = useTranslations('ContactPage');

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-primary-700 mb-4">
          {office.name}
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <span className="text-neutral-500">{t('address')}</span>
            <span>{office.address}</span>
          </div>
          {office.zipCode && (
            <div>
              <span className="text-neutral-500">{t('zipCode')}</span>
              <span>{office.zipCode}</span>
            </div>
          )}
          <div>
            <span className="text-neutral-500">{t('phone')}</span>
            <a href={`tel:${office.phone}`} className="text-primary-600 hover:text-primary-700">
              {office.phone}
            </a>
            {office.phone2 && (
              <>
                <br />
                <span className="inline-block ml-[3em]">
                  <a href={`tel:${office.phone2}`} className="text-primary-600 hover:text-primary-700">
                    {office.phone2}
                  </a>
                </span>
              </>
            )}
          </div>
          {office.fax && (
            <div>
              <span className="text-neutral-500">{t('fax')}</span>
              <span>{office.fax}</span>
            </div>
          )}
          {office.email && (
            <div>
              <span className="text-neutral-500">{t('email')}</span>
              <a href={`mailto:${office.email}`} className="text-primary-600 hover:text-primary-700">
                {office.email}
              </a>
            </div>
          )}
          {office.website && (
            <div>
              <span className="text-neutral-500">{t('website')}</span>
              <a href={office.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                {office.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfficeCard({ office }: { office: OfficeData }) {
  const t = useTranslations('ContactPage');

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-primary-700 mb-3">
          {office.name}
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <span className="text-neutral-500">{t('address')}</span>
            <span>{office.address}</span>
          </div>
          <div>
            <span className="text-neutral-500">{t('phone')}</span>
            <a href={`tel:${office.phone}`} className="text-primary-600 hover:text-primary-700">
              {office.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OfficesSection({ locale, title, offices, mapConfig }: OfficesSectionProps) {
  const hq = offices.find((o) => o.isHQ);
  const branches = offices.filter((o) => !o.isHQ);

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">{title}</h2>
        )}

        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* HQ - spans 2 cols and 2 rows on lg */}
          {hq && (
            <div className="lg:col-span-2 lg:row-span-2">
              <HQCard office={hq} />
            </div>
          )}

          {/* Branch offices - fill remaining grid */}
          {branches.map((office) => (
            <OfficeCard key={office.documentId || office.name} office={office} />
          ))}
        </div>

        {/* Map with all office markers */}
        <div className="space-y-2">
          <LeafletMap offices={offices} mapConfig={mapConfig} />
        </div>
      </div>
    </section>
  );
}
