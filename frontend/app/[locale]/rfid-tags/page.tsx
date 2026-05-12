import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getRfidTagCategories, getRfidTags, RfidTagData, RfidTagCategoryData } from '@/lib/strapi';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getStrapiImageUrl } from '@/lib/strapi';

interface RfidTagsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RfidTagsPage({ params }: RfidTagsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'RfidTags' });

  const [categories, tags] = await Promise.all([
    getRfidTagCategories(locale).catch(() => []),
    getRfidTags(locale).catch(() => []),
  ]);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="w-12 h-0.5 bg-primary-500 mb-4" />
          <h1 className="text-4xl font-bold text-neutral-900">{t('title')}</h1>
          <p className="text-neutral-600 mt-3">{t('subtitle')}</p>
        </div>

        <div className="flex gap-10">
          {/* Category Sidebar */}
          {categories.length > 0 && (
            <aside className="hidden lg:block w-56 shrink-0">
              <h2 className="font-semibold text-neutral-900 mb-4">{t('categories')}</h2>
              <nav className="space-y-2">
                <Link
                  href={`/${locale}/rfid-tags`}
                  className="block text-sm text-primary-600 font-medium"
                >
                  {t('allTags')}
                </Link>
                {categories.map((cat: RfidTagCategoryData) => (
                  <Link
                    key={cat.slug}
                    href={`/${locale}/rfid-tags/category/${cat.slug}`}
                    className="block text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </aside>
          )}

          {/* Tag Grid */}
          <div className="flex-1">
            {tags.length === 0 ? (
              <p className="text-neutral-500">{t('empty')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tags.map((tag: RfidTagData) => (
                  <Link key={tag.slug} href={`/${locale}/rfid-tags/${tag.slug}`}>
                    <Card className="h-full">
                      {(tag.images?.[0] || tag.imageUrl) && (
                        <div className="relative overflow-hidden h-52">
                          <Image
                            src={tag.imageUrl || getStrapiImageUrl(tag.images[0].url) || '/placeholder.png'}
                            alt={tag.images?.[0]?.alternativeText || tag.name}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-neutral-900 mb-2 font-display">{tag.name}</h3>
                        {tag.description && (
                          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">{tag.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {tag.frequency && <Badge variant="accent">{tag.frequency}</Badge>}
                          {tag.category && <Badge variant="primary">{tag.category.name}</Badge>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
