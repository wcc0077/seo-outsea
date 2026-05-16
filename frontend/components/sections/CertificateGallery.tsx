'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getStrapiImageUrl } from '@/lib/strapi';

interface CertificateItem {
  title: string;
  image?: { url: string };
  category?: string;
}

interface CertificateGalleryProps {
  title?: string;
  certificates?: CertificateItem[];
}

const CATEGORY_LABELS: Record<string, string> = {
  qualification: 'Qualification',
  certification: 'Certification',
  ip: 'Intellectual Property',
};

export default function CertificateGallery({ title, certificates = [] }: CertificateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...new Set(certificates.map(c => c.category).filter((c): c is string => Boolean(c)))];
  const filtered = activeCategory === 'all'
    ? certificates
    : certificates.filter(c => c.category === activeCategory);

  if (certificates.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}

        {categories.length > 1 && (
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((cert, idx) => (
            <div key={idx} className="group relative bg-neutral-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              {cert.image?.url && (
                <div className="relative aspect-[3/4] mb-3 overflow-hidden rounded">
                  <Image
                    src={getStrapiImageUrl(cert.image.url) ?? ''}
                    alt={cert.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              )}
              <p className="text-sm text-neutral-700 text-center line-clamp-2">{cert.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
