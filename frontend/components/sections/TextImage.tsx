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
    <img
      src={imageUrl}
      alt={image?.alternativeText || title || ''}
      className="w-full h-full min-h-[300px] object-cover rounded-xl"
    />
  ) : null;

  const textEl = (
    <div className="flex flex-col justify-center">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>}
      {content && (
        <div
          className="text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${imagePosition === 'right' ? '' : 'md:[&>*:first-child]:order-2'}`}>
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
