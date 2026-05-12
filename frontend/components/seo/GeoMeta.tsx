// frontend/components/seo/GeoMeta.tsx

interface GeoMetaProps {
  placename?: string;
  position?: string; // latitude, longitude
  region?: string;
  icbm?: string; // latitude, longitude for ICBM meta tag
}

export default function GeoMeta({
  placename,
  position,
  region,
  icbm,
}: GeoMetaProps) {
  return (
    <>
      {placename && <meta name="geo.placename" content={placename} />}
      {region && <meta name="geo.region" content={region} />}
      {position && <meta name="geo.position" content={position} />}
      {icbm && <meta name="ICBM" content={icbm} />}
    </>
  );
}
