'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CertificateLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function CertificateLightbox({ src, alt, onClose }: CertificateLightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="max-h-[90vh] max-w-[90vw] p-4" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl" />
        <p className="text-center text-sm text-neutral-400 mt-4">{alt}</p>
      </div>
    </div>,
    document.body
  );
}
