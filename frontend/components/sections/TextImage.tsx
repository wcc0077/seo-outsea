import { getStrapiImageUrl } from '@/lib/strapi';

interface TextImageProps {
  title?: string;
  content?: string;
  image?: { url: string; alternativeText: string };
  imagePosition?: 'left' | 'right';
}

export default function TextImage({ title, content, image, imagePosition = 'left' }: TextImageProps) {
  const imageUrl = getStrapiImageUrl(image?.url);

  const imageEl = imageUrl ? (
    <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-neutral-900/10">
      <img
        src={imageUrl}
        alt={image?.alternativeText || title || ''}
        className="w-full h-full min-h-[320px] object-cover"
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent" />
    </div>
  ) : null;

  const textEl = (
    <div className="flex flex-col justify-center">
      {title && (
        <>
          <div className="w-12 h-0.5 bg-primary-500 mb-5" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-5 font-display">{title}</h2>
        </>
      )}
      {content && (
        <div
          className="text-neutral-600 prose prose-sm max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {imagePosition === 'left' ? (
            <>
              {imageEl}
              {textEl}
            </>
          ) : (
            <>
              {textEl}
              {imageEl}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
