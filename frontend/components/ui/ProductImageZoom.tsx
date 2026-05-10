'use client';

import { useState, useRef, useEffect } from 'react';

interface ProductImageZoomProps {
  mainImage: string;
  alt: string;
  images?: Array<{ url: string; alternativeText: string }>;
}

export default function ProductImageZoom({ mainImage, alt, images }: ProductImageZoomProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }); // Normalized 0-1
  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom scale
  const ZOOM_SCALE = 2.5;
  const IMAGE_SIZE = 350;
  const PANEL_SIZE = 350;

  // Handle mouse movement - get normalized position (0-1)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1
    setMousePosition({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    });
  };

  // Calculate transform for zoomed image
  // Shift the image so the mouse point appears at panel center
  const zoomTransform = {
    // Move image left/up to center the mouse point
    // Formula: translate by -(mousePos * scale - 0.5) * panelSize
    x: -(mousePosition.x * ZOOM_SCALE - 0.5) * PANEL_SIZE,
    y: -(mousePosition.y * ZOOM_SCALE - 0.5) * PANEL_SIZE,
  };

  // Cursor indicator (square lens) on main image
  // The lens size shows the area being displayed in zoom panel
  const lensSize = PANEL_SIZE / ZOOM_SCALE; // Area that fits in zoom panel
  const lensX = mousePosition.x * IMAGE_SIZE - lensSize / 2;
  const lensY = mousePosition.y * IMAGE_SIZE - lensSize / 2;

  return (
    <div className="flex items-start gap-4" style={{ width: IMAGE_SIZE + PANEL_SIZE + 16 }}>
      {/* Left: Main Image */}
      <div className="flex flex-col">
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg shadow-sm border border-neutral-200 cursor-crosshair bg-white"
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={selectedImage}
            alt={alt}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Square Lens Indicator - shows area being zoomed */}
          {isHovering && (
            <div
              className="absolute border-2 border-blue-500 bg-white/10 pointer-events-none z-10"
              style={{
                width: lensSize,
                height: lensSize,
                left: Math.max(0, Math.min(lensX, IMAGE_SIZE - lensSize)),
                top: Math.max(0, Math.min(lensY, IMAGE_SIZE - lensSize)),
                boxShadow: '0 0 0 1px rgba(255,255,255,0.5)',
              }}
            />
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images && images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.slice(0, 5).map((img, i) => {
              const isSelected = selectedImage === img.url || (i === 0 && selectedImage === mainImage);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.url)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                  style={{ width: 50, height: 50 }}
                >
                  <img
                    src={img.url}
                    alt={img.alternativeText || `${alt} ${i + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Zoom Panel */}
      <div
        className={`relative overflow-hidden rounded-lg shadow-lg border border-neutral-200 bg-white transition-opacity duration-150 ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: PANEL_SIZE, height: PANEL_SIZE }}
      >
        {/* Zoomed Image - scaled and positioned */}
        <img
          src={selectedImage}
          alt={`${alt} - 放大视图`}
          className="absolute"
          style={{
            width: IMAGE_SIZE * ZOOM_SCALE,
            height: IMAGE_SIZE * ZOOM_SCALE,
            transform: `translate(${zoomTransform.x}px, ${zoomTransform.y}px)`,
            objectFit: 'cover',
          }}
          draggable={false}
        />

        {/* Zoom hint */}
        {isHovering && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none z-10">
            2.5x 放大
          </div>
        )}
      </div>
    </div>
  );
}