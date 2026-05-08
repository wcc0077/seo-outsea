import { notFound } from 'next/navigation';
import { getRfidTagCategoryBySlug, getRfidTagsByCategory, RfidTagData, RfidTagCategoryData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getStrapiImageUrl } from '@/lib/strapi';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;

  const [category, tags] = await Promise.all([
    getRfidTagCategoryBySlug(slug, locale),
    getRfidTagsByCategory(slug, locale).catch(() => []),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">{category.name}</h1>
          {category.description && (
            <div
              className="text-neutral-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          )}
        </div>

        {tags.length === 0 ? (
          <p className="text-neutral-500">No tags in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tags.map((tag: RfidTagData) => (
              <Link key={tag.slug} href={`/${locale}/rfid-tags/${tag.slug}`}>
                <Card className="h-full">
                  {(tag.images?.[0] || tag.imageUrl) && (
                    <div className="relative overflow-hidden">
                      <img
                        src={tag.imageUrl || getStrapiImageUrl(tag.images[0].url) || '/placeholder.png'}
                        alt={tag.images?.[0]?.alternativeText || tag.name}
                        className="w-full h-52 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-neutral-900 mb-2 font-display">{tag.name}</h3>
                    {tag.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{tag.description}</p>
                    )}
                    {tag.frequency && <Badge className="mt-4" variant="accent">{tag.frequency}</Badge>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
