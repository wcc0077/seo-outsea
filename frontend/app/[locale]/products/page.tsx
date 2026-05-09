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

// Map rfid tagType -> product-category slug for unified filtering
const TAG_TYPE_TO_CATEGORY: Record<string, { name: string; slug: string }> = {
  carrier: { name: '工业载码体', slug: 'industrial-carriers' },
  'high-temp': { name: '耐高温标签', slug: 'high-temp-tags' },
  'anti-metal': { name: '抗金属标签', slug: 'anti-metal-tags' },
  flexible: { name: '易碎防转移标签', slug: 'fragile-tags' },
  card: { name: '智能卡与不干胶标签', slug: 'cards-adhesive-tags' },
  'key-fob': { name: '其他特种标签', slug: 'special-tags' },
  wristband: { name: '其他特种标签', slug: 'special-tags' },
  custom: { name: '有源电子标签', slug: 'active-tags' },
};

  // Map rfid-tag data to ProductData shape for unified rendering
  const mappedRfidTags = rfidTags.map(tag => {
    const catInfo = TAG_TYPE_TO_CATEGORY[tag.frequency === 'active' ? 'custom' : tag.tagType || ''];
    return {
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      specs: tag.specs || [],
      images: tag.images || [],
      imageUrl: tag.imageUrl || '',
      category: catInfo ? {
        name: catInfo.name,
        slug: catInfo.slug,
        description: '',
        sortOrder: 0,
        documentId: catInfo.slug,
        publishedAt: null,
      } as MinimalCategory : undefined,
      rfidFrequency: (() => {
        const f = tag.frequency?.toLowerCase();
        if (f === 'uhf') return 'uhf';
        if (f === 'hf') return 'hf';
        if (f === 'lf') return 'lf-125khz';
        if (f === 'dual') return null;
        if (f === 'active') return null;
        return null;
      })() as 'uhf' | 'hf' | 'lf-125khz' | 'lf-134khz' | 'vhf' | null,
      features: [] as string[],
      connectivity: [] as string[],
      os: null as 'android' | 'windows' | 'other' | null,
      seoTitle: tag.seoTitle || '',
      seoDescription: tag.seoDescription || '',
      seoKeywords: tag.seoKeywords || '',
    };
  });

  // Deduplicate RFID tags by slug (Strapi i18n creates duplicate rows)
  const seenRfidSlugs = new Set<string>();
  const uniqueRfidTags = mappedRfidTags.filter(t => {
    if (seenRfidSlugs.has(t.slug)) return false;
    seenRfidSlugs.add(t.slug);
    return true;
  });

  // Merge products and deduplicated RFID tags
  const allProducts = [...products, ...uniqueRfidTags];

  // Deduplicate merged products by slug in case of name overlap
  const seenProductSlugs = new Set<string>();
  const uniqueProducts = allProducts.filter(p => {
    if (seenProductSlugs.has(p.slug)) return false;
    seenProductSlugs.add(p.slug);
    return true;
  });

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

  // Deduplicate categories by slug to handle Strapi i18n duplicates
  const seen = new Set<string>();
  const uniqueCategories = allCategories.filter(cat => {
    if (seen.has(cat.slug)) return false;
    seen.add(cat.slug);
    return true;
  });

  return (
    <ProductsPageClient
      products={uniqueProducts as any}
      categories={uniqueCategories as any}
      locale={locale}
    />
  );
}
