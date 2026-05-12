import Link from 'next/link';
import { GlobalData, getProductCategories, getApplicationCategories, ApplicationCategoryData, ProductCategoryData } from '@/lib/strapi';
import { getTranslations } from 'next-intl/server';

interface FooterProps {
  global: GlobalData | null;
  locale: string;
  currentYear: number;
}

export default async function Footer({ global, locale, currentYear }: FooterProps) {
  const contact = global?.contactInfo;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  const [allCategories, appCategories] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
  ]);

  // Filter only published categories (Strapi returns both draft + published)
  const published = allCategories.filter((c) => c.publishedAt !== null);

  // Top-level categories: parent is null
  const topLevel = published.filter((c) => !c.parent);

  // Group children by their parent's documentId
  const childMap = new Map<string, typeof published>();
  for (const cat of published) {
    if (cat.parent?.documentId) {
      const parentId = cat.parent.documentId;
      if (!childMap.has(parentId)) childMap.set(parentId, []);
      childMap.get(parentId)!.push(cat);
    }
  }

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

          {/* Product category columns from Strapi */}
          {topLevel.map((category) => {
            const docId = category.documentId;
            const children = childMap.get(docId) || [];
            return (
              <div key={category.slug}>
                <h3 className="text-white font-semibold mb-4 font-display text-sm">{category.name}</h3>
                <ul className="space-y-2.5 text-sm">
                  {children.length > 0
                    ? children.map((child) => (
                        <li key={child.slug}>
                          <Link href={`/${locale}/products/category/${child.slug}`} className="hover:text-primary-400 transition-colors break-all">
                            {child.name}
                          </Link>
                        </li>
                      ))
                    : (
                      <li>
                        <Link href={`/${locale}/products/category/${category.slug}`} className="hover:text-primary-400 transition-colors">
                          {category.name}
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
              {appCategories.map((cat: ApplicationCategoryData) => (
                <li key={cat.slug}>
                  <Link href={`/${locale}/applications/category/${cat.slug}`} className="hover:text-primary-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
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
