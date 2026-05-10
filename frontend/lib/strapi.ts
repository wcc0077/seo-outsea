const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

interface FetchOptions {
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${STRAPI_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function fetchApi<T>(path: string, params?: Record<string, string | number | undefined>, options?: FetchOptions): Promise<T> {
  const url = buildUrl(path, { ...params, populate: '*' });
  const res = await fetch(url, {
    cache: options?.cache || 'force-cache',
    next: options?.next,
    headers: STRAPI_TOKEN ? { 'Authorization': `Bearer ${STRAPI_TOKEN}` } : {},
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---- Global ----

export interface GlobalData {
  siteName: string;
  logo?: { url: string; alternativeText: string };
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    qrCode?: { url: string };
  }>;
  languages: Array<{
    code: string;
    name: string;
    enabled: boolean;
  }>;
  defaultLocale: string;
}

export async function getGlobal(): Promise<GlobalData> {
  const res = await fetchApi<{ data: GlobalData }>('/api/global');
  return res.data;
}

// ---- Pages ----

export interface PageData {
  slug: string;
  title: string;
  heroBanner: {
    title: string;
    subtitle: string;
    backgroundImage?: { url: string; alternativeText: string };
    ctaLabel: string;
    ctaUrl: string;
  };
  sections: Array<SectionData>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface SectionData {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export async function getPageBySlug(slug: string, locale: string): Promise<PageData | null> {
  try {
    const res = await fetchApi<{ data: PageData }>(`/api/pages/by-slug/${slug}`, { locale });
    return res.data;
  } catch {
    return null;
  }
}

export async function getAllPages(locale: string): Promise<PageData[]> {
  const res = await fetchApi<{ data: PageData[] }>('/api/pages', { locale });
  return res.data;
}

// ---- Product Categories ----

export interface ProductCategoryData {
  id?: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  publishedAt?: string | null;
  parent?: ProductCategoryData;
  children?: ProductCategoryData[];
  sortOrder: number;
  image?: { url: string; alternativeText: string };
}

export async function getProductCategories(locale: string): Promise<ProductCategoryData[]> {
  const res = await fetchApi<{ data: ProductCategoryData[] }>('/api/product-categories', {
    locale,
    'filters[publishedAt][$notNull]': 'true',
    'sort[0]': 'sortOrder:asc',
  });

  // Deduplicate by documentId to handle Strapi i18n duplicates
  const seen = new Set<string>();
  return res.data.filter(cat => {
    const key = cat.documentId || cat.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getProductCategoryBySlug(slug: string, locale: string): Promise<ProductCategoryData | null> {
  try {
    const res = await fetchApi<{ data: ProductCategoryData }>(
      `/api/product-categories/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Products ----

export interface ProductTagData {
  label: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface ProductData {
  id?: number;
  documentId?: string;
  name: string;
  slug: string;
  description: string;
  specs: Array<{ name: string; value: string }>;
  tags?: ProductTagData[];
  images: Array<{ url: string; alternativeText: string }>;
  imageUrl: string;
  category?: ProductCategoryData;
  rfidFrequency?: 'uhf' | 'hf' | 'lf-125khz' | 'lf-134khz' | 'vhf';
  features?: string[];
  connectivity?: string[];
  os?: 'android' | 'windows' | 'other' | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  publishedAt?: string | null;
}

export async function getProducts(locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>('/api/products', { locale });

  // Filter published products and deduplicate by documentId
  const published = res.data.filter((p) => p.publishedAt !== null && p.slug);
  const seen = new Set<string>();
  return published.filter((p) => {
    const key = p.documentId || p.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getProductsByCategory(categorySlug: string, locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>(
    `/api/products/by-category/${categorySlug}`,
    { locale }
  );
  return res.data;
}

export async function getProductBySlug(slug: string, locale: string): Promise<ProductData | null> {
  try {
    const res = await fetchApi<{ data: ProductData }>(
      `/api/products/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Applications ----

export interface ApplicationData {
  documentId?: string;
  name: string;
  slug: string;
  description: string;
  images: Array<{ url: string; alternativeText: string }>;
  imageUrl: string | null;
  useCase: string;
  category?: ApplicationCategoryData;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export async function getApplications(locale: string): Promise<ApplicationData[]> {
  const res = await fetchApi<{ data: ApplicationData[] }>('/api/applications', {
    locale,
    populate: 'images,category',
  }, { next: { revalidate: 60 } }); // Revalidate every 60 seconds

  // Deduplicate by documentId to handle Strapi i18n duplicates
  const seen = new Set<string>();
  return res.data.filter(app => {
    // Prefer published entries; if same documentId appears twice, keep first
    const key = app.documentId || app.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getApplicationBySlug(slug: string, locale: string): Promise<ApplicationData | null> {
  try {
    const res = await fetchApi<{ data: ApplicationData }>(
      `/api/applications/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

export async function getApplicationsByCategory(categorySlug: string, locale: string): Promise<ApplicationData[]> {
  const res = await fetchApi<{ data: ApplicationData[] }>(
    `/api/applications/by-category/${categorySlug}`,
    { locale }
  );
  return res.data;
}

// ---- Application Categories ----

export interface ApplicationCategoryData {
  id?: number;
  documentId?: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sortOrder: number;
  publishedAt?: string | null;
  image?: { url: string; alternativeText: string } | null;
}

export async function getApplicationCategories(locale: string): Promise<ApplicationCategoryData[]> {
  const res = await fetchApi<{ data: ApplicationCategoryData[] }>('/api/application-categories', {
    locale,
    'sort[0]': 'sortOrder:asc',
  });

  // Filter published categories and deduplicate by documentId
  const published = res.data.filter((cat) => cat.publishedAt !== null);
  const seen = new Set<string>();
  return published.filter((cat) => {
    const key = cat.documentId || cat.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getApplicationCategoryBySlug(slug: string, locale: string): Promise<ApplicationCategoryData | null> {
  try {
    const res = await fetchApi<{ data: ApplicationCategoryData }>(
      `/api/application-categories/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- News ----

export interface NewsData {
  title: string;
  slug: string;
  content: string;
  coverImage?: { url: string; alternativeText: string };
  publishDate: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
}

interface NewsPaginationMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export async function getPublishedNews(locale: string, page = 1, pageSize = 10): Promise<{ data: NewsData[]; meta: NewsPaginationMeta }> {
  const res = await fetchApi<{ data: NewsData[]; meta: NewsPaginationMeta }>(
    '/api/news/published',
    { locale, page: String(page), pageSize: String(pageSize) }
  );
  return res;
}

export async function getNewsBySlug(slug: string, locale: string): Promise<NewsData | null> {
  try {
    const res = await fetchApi<{ data: NewsData }>(
      `/api/news-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- RFID Tag Categories (unified into Product Category) ----

export type RfidTagCategoryData = ProductCategoryData;

export async function getRfidTagCategories(locale: string): Promise<RfidTagCategoryData[]> {
  const allCategories = await getProductCategories(locale);
  const rfidTagParent = allCategories.find((c) => c.slug === 'rfid-tags');
  if (!rfidTagParent) return [];
  return allCategories.filter((c) => c.parent?.documentId === rfidTagParent.documentId);
}

export async function getRfidTagCategoryBySlug(slug: string, locale: string): Promise<RfidTagCategoryData | null> {
  return getProductCategoryBySlug(slug, locale);
}

// ---- RFID Tags ----

export interface RfidTagData {
  id?: number;
  documentId?: string;
  name: string;
  slug: string;
  model?: string;
  description: string;
  tagType?: string;
  frequency?: string;
  specs: Array<{ name: string; value: string }>;
  images: Array<{ url: string; alternativeText: string }>;
  imageUrl: string;
  category?: RfidTagCategoryData;
  applicationScenarios: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  publishedAt?: string | null;
}

export async function getRfidTags(locale: string): Promise<RfidTagData[]> {
  const res = await fetchApi<{ data: RfidTagData[] }>('/api/rfid-tags', { locale });

  // Filter published tags and deduplicate by slug
  const published = res.data.filter((t) => t.publishedAt !== null && t.slug);
  const seen = new Set<string>();
  return published.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });
}

export async function getRfidTagsByCategory(categorySlug: string, locale: string): Promise<RfidTagData[]> {
  const res = await fetchApi<{ data: RfidTagData[] }>(
    `/api/rfid-tags/by-category/${categorySlug}`,
    { locale }
  );

  // Filter published tags and deduplicate by slug
  const published = res.data.filter((t) => t.publishedAt !== null && t.slug);
  const seen = new Set<string>();
  return published.filter((t) => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });
}

export async function getRfidTagBySlug(slug: string, locale: string): Promise<RfidTagData | null> {
  try {
    const res = await fetchApi<{ data: RfidTagData }>(
      `/api/rfid-tags/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}

// ---- Image URL Helper ----

export function getStrapiImageUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// ---- About Pages ----

export interface AboutPageData {
  id: number;
  title: string;
  slug: string;
  pageType: 'intro' | 'gallery' | 'history' | 'honors';
  content: string;
  sortOrder: number;
  images?: Array<{ url: string; alternativeText: string }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export async function getAboutPageBySlug(slug: string, locale: string): Promise<AboutPageData | null> {
  try {
    const res = await fetchApi<{ data: AboutPageData }>(`/api/about-pages/by-slug/${slug}`, { locale });
    return res.data;
  } catch {
    return null;
  }
}

// ---- FAQ Articles ----

export interface FAQArticleData {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  publishDate: string;
  author: string;
  order: number;
  seoTitle: string;
  seoDescription: string;
}

export async function getFAQArticles(locale: string, category?: string): Promise<FAQArticleData[]> {
  const params: Record<string, string> = { locale, pageSize: '20' };
  if (category) params.category = category;
  const res = await fetchApi<{ data: FAQArticleData[] }>('/api/faq/knowledge', params, {
    cache: 'no-store',
  });
  return res.data;
}

export async function getFAQArticleBySlug(slug: string, locale: string): Promise<FAQArticleData | null> {
  try {
    const res = await fetchApi<{ data: FAQArticleData }>(
      `/api/faq-articles/by-slug/${slug}`,
      { locale }
    );
    return res.data;
  } catch {
    return null;
  }
}
