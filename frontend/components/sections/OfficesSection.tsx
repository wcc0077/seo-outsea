'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OfficeLocation {
  name: string;
  nameEn: string;
  address: string;
  addressEn: string;
  phone: string;
  phone2?: string;
  fax?: string;
  email?: string;
  zipCode?: string;
  website?: string;
  lat: number;
  lng: number;
  isHQ?: boolean;
}

const OFFICES: OfficeLocation[] = [
  {
    name: '上海总部',
    nameEn: 'Shanghai Headquarters',
    address: '上海市闵行区新骏环路588弄23幢东4-5层',
    addressEn: '4-5F, Bldg 23, Lane 588 Xinjun Huan Rd, Minhang District, Shanghai',
    phone: '4000-56-5516（物联 物物易联）',
    phone2: '021-5432-6377',
    fax: '021-5432-5266',
    email: 'sales@fn-tech.com',
    website: 'https://www.fn-tech.com',
    zipCode: '201112',
    lat: 31.022,
    lng: 121.395,
    isHQ: true,
  },
  {
    name: '山东办',
    nameEn: 'Shandong Office',
    address: '济南市高新区会展香格里拉东北塔916号',
    addressEn: 'Rm 916, NE Tower, Shangri-La Exhibition Center, Hi-Tech Zone, Jinan',
    phone: '4000-56-5516（物联 物物易联）',
    lat: 36.6512,
    lng: 117.1201,
  },
  {
    name: '成都办',
    nameEn: 'Chengdu Office',
    address: '成都市武侯区府城大道西段399号7号楼3单元1204室',
    addressEn: 'Rm 1204, Unit 3, Bldg 7, No. 399 W. Fucheng Ave, Wuhou District, Chengdu',
    phone: '4000-56-5516（物联 物物易联）',
    lat: 30.5728,
    lng: 104.0668,
  },
  {
    name: '长沙办',
    nameEn: 'Changsha Office',
    address: '湖南省长沙市岳麓区润嘉公园道B栋14楼',
    addressEn: '14F, Bldg B, Runjia Park Avenue, Yuelu District, Changsha',
    phone: '4000-56-5516（物联 物物易联）',
    lat: 28.228,
    lng: 112.9388,
  },
  {
    name: '武汉办',
    nameEn: 'Wuhan Office',
    address: '武汉市汉阳区蔷薇路泰富城1栋3单元D1212室',
    addressEn: 'Rm D1212, Unit 3, Bldg 1, Taifu City, Qiangwei Rd, Hanyang District, Wuhan',
    phone: '4000-56-5516（物联 物物易联）',
    lat: 30.5928,
    lng: 114.3055,
  },
];

function HQMarker({ office, isZh }: { office: OfficeLocation; isZh: boolean }) {
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
          <strong className="text-primary-700">{isZh ? office.name : office.nameEn}</strong>
          <br />
          <span className="text-neutral-600">{isZh ? office.address : office.addressEn}</span>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function LeafletMap({ locale }: { locale: string }) {
  const isZh = locale === 'zh';

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      <MapContainer
        center={[33, 108]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {OFFICES.map((office) =>
          office.isHQ ? (
            <HQMarker key={office.name} office={office} isZh={isZh} />
          ) : (
            <CircleMarker
              key={office.name}
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
                  <strong className="text-primary-700">{isZh ? office.name : office.nameEn}</strong>
                  <br />
                  <span className="text-neutral-600">{isZh ? office.address : office.addressEn}</span>
                </div>
              </Popup>
            </CircleMarker>
          )
        )}
      </MapContainer>
    </div>
  );
}

function HQCard({ office, locale }: { office: OfficeLocation; locale: string }) {
  const t = useTranslations('ContactPage');
  const isZh = locale === 'zh';

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-primary-700 mb-4">
          {isZh ? office.name : office.nameEn}
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <span className="text-neutral-500">{t('address')}</span>
            <span>{isZh ? office.address : office.addressEn}</span>
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

function OfficeCard({ office, locale }: { office: OfficeLocation; locale: string }) {
  const t = useTranslations('ContactPage');
  const isZh = locale === 'zh';

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-primary-700 mb-3">
          {isZh ? office.name : office.nameEn}
        </h3>
        <div className="space-y-2 text-sm text-neutral-700">
          <div>
            <span className="text-neutral-500">{t('address')}</span>
            <span>{isZh ? office.address : office.addressEn}</span>
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

export default function OfficesSection({ locale }: { locale: string }) {
  const t = useTranslations('ContactPage');
  const hq = OFFICES.find((o) => o.isHQ)!;
  const branches = OFFICES.filter((o) => !o.isHQ);

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Office Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* HQ - spans 2 cols and 2 rows on lg */}
          <div className="lg:col-span-2 lg:row-span-2">
            <HQCard office={hq} locale={locale} />
          </div>

          {/* Branch offices - fill remaining grid */}
          {branches.map((office) => (
            <OfficeCard key={office.name} office={office} locale={locale} />
          ))}
        </div>

        {/* Map with all office markers */}
        <div className="space-y-2">
          <LeafletMap locale={locale} />
        </div>
      </div>
    </section>
  );
}
