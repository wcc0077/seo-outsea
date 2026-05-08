'use client';

import { useState } from 'react';
import CertificateLightbox from '@/components/ui/CertificateLightbox';

interface CertificateImage {
  src: string;
  alt: string;
}

interface CertificateGalleryProps {
  images: CertificateImage[];
  title: string;
  titleEn: string;
}

export default function CertificateGallery({ images, title, titleEn }: CertificateGalleryProps) {
  const [selected, setSelected] = useState<CertificateImage | null>(null);

  return (
    <>
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
              {titleEn}
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(img)}
                className="block w-full group rounded-xl overflow-hidden border border-neutral-700/30 bg-neutral-800/30 hover:border-primary-500/30 transition-all duration-300 text-left cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-neutral-400 group-hover:text-primary-400 transition-colors">{img.alt}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <CertificateLightbox
          src={selected.src}
          alt={selected.alt}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
