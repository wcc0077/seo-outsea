import Link from 'next/link';
import { GlobalData, getProductCategories, getApplicationCategories, ApplicationCategoryData, ProductCategoryData } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
  currentYear: number;
}

// Hardcoded fallback product columns for when Strapi is unavailable
const FALLBACK_PRODUCT_COLUMNS: Array<{ name: string; slug: string; children: Array<{ name: string; slug: string }> }> = [
  {
    name: '智能移动终端',
    slug: 'mobile-devices',
    children: [
      { name: '多功能手持终端', slug: 'handheld-terminals' },
      { name: '多功能工业平板', slug: 'industrial-tablets' },
      { name: '便携式RFID读写器', slug: 'portable-readers' },
    ],
  },
  {
    name: 'RFID读写器',
    slug: 'rfid-readers',
    children: [
      { name: '工业读写器', slug: 'industrial-readers' },
      { name: '超高频读写器', slug: 'uhf-readers' },
      { name: '高频读写器', slug: 'hf-readers' },
      { name: '有源读写器', slug: 'active-readers' },
      { name: '模块集成', slug: 'module-integration' },
    ],
  },
  {
    name: 'RFID电子标签',
    slug: 'rfid-tags',
    children: [
      { name: 'RFID工业载体', slug: 'industrial-carriers' },
      { name: 'RFID耐温标签', slug: 'high-temp-tags' },
      { name: 'RFID抗金属标签', slug: 'metal-tags' },
      { name: 'RFID易碎转移标签', slug: 'tamper-evident-tags' },
      { name: '智能卡与不干胶标签', slug: 'smart-card-labels' },
      { name: '其他特种标签', slug: 'other-special-tags' },
      { name: '有源电子标签', slug: 'active-tags' },
    ],
  },
];

export default async function Footer({ global, locale, currentYear }: FooterProps) {
  const contact = global?.contactInfo;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  const [allCategories, appCategories] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
  ]);

  // Filter only published categories (Strapi returns both draft + published)
  const published = allCategories.filter((c) => c.publishedAt !== null);

  // Footer product columns: use Strapi data if available, fallback to hardcoded
  const footerProductSlugs = ['mobile-devices', 'rfid-readers', 'rfid-tags'];
  const productTopLevel = published
    .filter((c) => !c.parent && footerProductSlugs.includes(c.slug))
    .sort((a, b) => footerProductSlugs.indexOf(a.slug) - footerProductSlugs.indexOf(b.slug));

  // Group children by their parent's slug
  const childMap = new Map<string, typeof published>();
  for (const cat of published) {
    if (cat.parent?.slug) {
      if (!childMap.has(cat.parent.slug)) childMap.set(cat.parent.slug, []);
      childMap.get(cat.parent.slug)!.push(cat);
    }
  }

  // Use fallback if no product categories from Strapi
  const useFallbackProducts = productTopLevel.length === 0;

  return (
    <footer className="bg-neutral-950 text-neutral-400 relative overflow-hidden">
      {/* RF wave decorative pattern */}
      <div className="absolute inset-0 bg-rf-waves opacity-50" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top accent line */}
        <div className="h-px w-24 bg-gradient-to-r from-primary-500 to-transparent mb-12" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-x-12 gap-y-10">
          {/* Company */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white font-semibold mb-4 font-display text-lg">{global?.siteName || 'FN Tech'}</h3>
            {contact && (
              <div className="space-y-2 text-sm leading-relaxed">
                {contact.address && <p>{contact.address}</p>}
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-400 transition-colors block">
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="hover:text-primary-400 transition-colors block">
                    {contact.email}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Product category columns from Strapi or fallback */}
          {(useFallbackProducts ? FALLBACK_PRODUCT_COLUMNS : productTopLevel).map((category) => {
            const isFallback = useFallbackProducts;
            const children = isFallback
              ? (category as typeof FALLBACK_PRODUCT_COLUMNS[0]).children
              : childMap.get((category as ProductCategoryData).slug) || [];
            const name = isFallback ? (category as typeof FALLBACK_PRODUCT_COLUMNS[0]).name : (category as ProductCategoryData).name;
            const slug = isFallback ? (category as typeof FALLBACK_PRODUCT_COLUMNS[0]).slug : (category as ProductCategoryData).slug;
            return (
              <div key={slug}>
                <h3 className="text-white font-semibold mb-4 font-display text-sm">{name}</h3>
                <ul className="space-y-2.5 text-sm">
                  {(children as Array<{ name: string; slug: string }>).length > 0
                    ? (children as Array<{ name: string; slug: string }>).map((child) => (
                        <li key={child.slug}>
                          <Link href={`/${locale}/products/category/${child.slug}`} className="hover:text-primary-400 transition-colors break-all">
                            {child.name}
                          </Link>
                        </li>
                      ))
                    : (
                      <li>
                        <Link href={`/${locale}/products/category/${slug}`} className="hover:text-primary-400 transition-colors">
                          {name}
                        </Link>
                      </li>
                    )}
                </ul>
              </div>
            );
          })}

          {/* 行业应用 */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">{t('applications')}</h3>
            <ul className="space-y-2.5 text-sm">
              {appCategories.length > 0
                ? appCategories.map((cat: ApplicationCategoryData) => (
                    <li key={cat.id}>
                      <Link href={`/${locale}/applications/category/${cat.slug}`} className="hover:text-primary-400 transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                : (
                  <>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('manufacturing')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('logistics')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('archiveLibrary')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('assetInspection')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('antiCounterfeit')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('retailSupplyChain')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('smartCity')}</Link></li>
                    <li><Link href={`/${locale}/applications`} className="hover:text-primary-400 transition-colors">{t('smartCabinet')}</Link></li>
                  </>
                )}
            </ul>
          </div>

          {/* 技术支持 */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">{t('support')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/products`} className="hover:text-primary-400 transition-colors">{t('productSupport')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-primary-400 transition-colors">{t('serviceSupport')}</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-primary-400 transition-colors">{t('faq')}</Link></li>
              <li><Link href={`/${locale}/sharing`} className="hover:text-primary-400 transition-colors">{t('knowledgeBase')}</Link></li>
            </ul>
          </div>

          {/* 关于孚恩 */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">{t('about')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/about/intro`} className="hover:text-primary-400 transition-colors">{t('companyIntro')}</Link></li>
              <li><Link href={`/${locale}/about/company`} className="hover:text-primary-400 transition-colors">{t('companyPhotos')}</Link></li>
              <li><Link href={`/${locale}/about/history`} className="hover:text-primary-400 transition-colors">{t('history')}</Link></li>
              <li><Link href={`/${locale}/about/honors`} className="hover:text-primary-400 transition-colors">{t('honors')}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:text-primary-400 transition-colors">{t('news')}</Link></li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-display text-sm">{t('contactUs')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${locale}/contact`} className="hover:text-primary-400 transition-colors">{t('contactUs')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-sm text-center text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>{t('copyright', { name: global?.siteName || 'FN Tech', startYear: 2006, endYear: currentYear })}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
