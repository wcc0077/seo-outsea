import { getRfidTags, getProductCategories, getProducts, getRfidTagCategories, deduplicateBy, mapRfidTagToProduct } from '@/lib/strapi';
import ProductsPageClient from './ProductsPageClient';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  const [categories, products, rfidTags, rfidTagCategories] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getProducts(locale).catch(() => []),
    getRfidTags(locale).catch(() => []),
    getRfidTagCategories(locale).catch(() => []),
  ]);

  const mappedRfidTags = rfidTags.map(mapRfidTagToProduct);
  const uniqueRfidTags = deduplicateBy(mappedRfidTags, (t) => t.slug);
  const allProducts = [...products, ...uniqueRfidTags];
  const uniqueProducts = deduplicateBy(allProducts, (p) => p.slug);

  const mergedRfidTagCategories = rfidTagCategories.map(c => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    documentId: c.slug,
    publishedAt: null as string | null,
    parent: c.parent ? {
      slug: c.parent.slug,
      name: c.parent.name,
      description: c.parent.description || '',
      sortOrder: c.parent.sortOrder || 0,
      documentId: c.parent.slug,
    } : undefined,
  }));

  const allCategories = [...categories, ...mergedRfidTagCategories];
  const uniqueCategories = deduplicateBy(allCategories, (cat) => cat.slug);

  return (
    <ProductsPageClient
      products={uniqueProducts}
      categories={uniqueCategories}
      locale={locale}
    />
  );
}
