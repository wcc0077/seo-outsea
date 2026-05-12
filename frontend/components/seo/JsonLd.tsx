// frontend/components/seo/JsonLd.tsx

'use client';

import { OrganizationStructuredData, WebsiteStructuredData } from './StructuredData';

interface JsonLdProps {
  type: 'organization' | 'website';
  data: Record<string, unknown>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  if (type === 'organization') {
    return <OrganizationStructuredData data={data as Parameters<typeof OrganizationStructuredData>[0]['data']} />;
  }

  if (type === 'website') {
    return <WebsiteStructuredData data={data as Parameters<typeof WebsiteStructuredData>[0]['data']} />;
  }

  return null;
}
