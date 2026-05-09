import { getRfidTags, getProductCategories, getProducts, getRfidTagCategories } from '@/lib/strapi';
import ProductsPageClient from './ProductsPageClient';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

// Minimal shapes for mapping rfid-tag data into ProductData
interface MinimalCategory {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  documentId: string;
  publishedAt: string | null;
  parent?: { slug: string; name: string; description: string; sortOrder: number; documentId: string } | null;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  const [categories, products, rfidTags, rfidTagCategories] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getProducts(locale).catch(() => []),
    getRfidTags(locale).catch(() => []),
    getRfidTagCategories(locale).catch(() => []),
  ]);

  // Map rfid-tag data to ProductData shape for unified rendering
  const mappedRfidTags = rfidTags.map(tag => ({
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    specs: tag.specs || [],
    images: tag.images || [],
    imageUrl: tag.imageUrl || '',
    category: tag.category ? {
      name: tag.category.name,
      slug: tag.category.slug,
      description: tag.category.description || '',
      sortOrder: tag.category.sortOrder || 0,
      documentId: tag.category.slug,
      publishedAt: null,
    } as MinimalCategory : undefined,
    rfidFrequency: (tag.frequency === 'uhf' ? 'uhf' : tag.frequency === 'hf' ? 'hf' : null) as 'uhf' | 'hf' | null,
    features: [] as string[],
    connectivity: [] as string[],
    os: null as 'android' | 'windows' | 'other' | null,
    seoTitle: tag.seoTitle || '',
    seoDescription: tag.seoDescription || '',
    seoKeywords: tag.seoKeywords || '',
  }));

  // Merge products and RFID tags
  const allProducts = [...products, ...mappedRfidTags];

  // Merge rfid-tag categories into the category list so tabs work
  const mergedRfidTagCategories: MinimalCategory[] = rfidTagCategories.map(c => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    documentId: c.slug,
    publishedAt: null,
    parent: c.parent ? {
      slug: c.parent.slug,
      name: c.parent.name,
      description: c.parent.description || '',
      sortOrder: c.parent.sortOrder || 0,
      documentId: c.parent.slug,
    } : undefined,
  }));

  const allCategories = [...categories, ...mergedRfidTagCategories];

  return (
    <ProductsPageClient
      products={allProducts as any}
      categories={allCategories as any}
      locale={locale}
    />
  );
}
