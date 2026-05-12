import { getTranslations } from 'next-intl/server';
import { getProductCategories, getApplicationCategories } from '@/lib/strapi';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

export async function getNavLinks(locale: string): Promise<NavItem[]> {
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const news = await getTranslations({ locale, namespace: 'News' });
  const about = await getTranslations({ locale, namespace: 'About' });

  // Fetch categories dynamically from Strapi
  const [productCategories, appCategories] = await Promise.all([
    getProductCategories(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
  ]);

  // Top-level product categories (parent is null)
  const productTopLevel = productCategories
    .filter((c) => !c.parent)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return [
    {
      label: t('products'),
      href: '/products',
      children: productTopLevel.length > 0
        ? productTopLevel.map((cat) => ({
            label: cat.name,
            href: `/products/category/${cat.slug}`,
          }))
        : [
            { label: t('smartMobileTerminals'), href: '/products' },
            { label: t('rfidReaders'), href: '/products' },
            { label: t('rfidTags'), href: '/products' },
          ],
    },
    {
      label: t('applications'),
      href: '/applications',
      children: appCategories.length > 0
        ? appCategories.map((cat) => ({
            label: cat.name,
            href: `/applications/category/${cat.slug}`,
          }))
        : [
            { label: t('smartManufacturing'), href: '/applications' },
            { label: t('warehouseLogistics'), href: '/applications' },
            { label: t('archiveLibrary'), href: '/applications' },
            { label: t('assetInspection'), href: '/applications' },
            { label: t('antiCounterfeit'), href: '/applications' },
            { label: t('retailSupplyChain'), href: '/applications' },
            { label: t('smartCity'), href: '/applications' },
            { label: t('smartCabinet'), href: '/applications' },
          ],
    },
    {
      label: t('support'),
      href: '/support',
      children: [
        { label: t('productSupport'), href: '/products' },
        { label: t('serviceSupport'), href: '/contact' },
        { label: t('faq'), href: '/sharing' },
        { label: t('knowledgeBase'), href: '/sharing' },
      ],
    },
    {
      label: t('about'),
      href: '/about',
      children: [
        { label: about('intro'), href: '/about/intro' },
        { label: about('gallery'), href: '/about/company' },
        { label: about('history'), href: '/about/history' },
        { label: about('honors'), href: '/about/honors' },
        { label: news('title'), href: '/news' },
      ],
    },
    { label: t('contact'), href: '/contact' },
  ];
}
