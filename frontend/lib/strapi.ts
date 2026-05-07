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
  name: string;
  slug: string;
  description: string;
  parent?: ProductCategoryData;
  children?: ProductCategoryData[];
  sortOrder: number;
  image?: { url: string; alternativeText: string };
}

export async function getProductCategories(locale: string): Promise<ProductCategoryData[]> {
  const res = await fetchApi<{ data: ProductCategoryData[] }>('/api/product-categories', {
    locale,
    'sort[0]': 'sortOrder:asc',
  });
  return res.data;
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

export interface ProductData {
  name: string;
  slug: string;
  description: string;
  specs: Array<{ name: string; value: string }>;
  images: Array<{ url: string; alternativeText: string }>;
  imageUrl: string;
  category?: ProductCategoryData;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export async function getProducts(locale: string): Promise<ProductData[]> {
  const res = await fetchApi<{ data: ProductData[] }>('/api/products', { locale });
  return res.data;
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
  name: string;
  slug: string;
  description: string;
  images: Array<{ url: string; alternativeText: string }>;
  useCase: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export async function getApplications(locale: string): Promise<ApplicationData[]> {
  const res = await fetchApi<{ data: ApplicationData[] }>('/api/applications', { locale });
  return res.data;
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
      `/api/news/by-slug/${slug}`,
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
