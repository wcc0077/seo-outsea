import { getTranslations } from 'next-intl/server';
import { getApplicationCategories } from '@/lib/strapi';

type NavItem = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string }>;
};

export async function getNavLinks(locale: string): Promise<NavItem[]> {
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  const news = await getTranslations({ locale, namespace: 'News' });
  const about = await getTranslations({ locale, namespace: 'About' });

  // Fetch application categories dynamically from Strapi
  const appCategories = await getApplicationCategories(locale).catch(() => []);

  return [
    {
      label: t('products'),
      href: '/products',
      children: [
        { label: t('smartMobileTerminals'), href: '/products' },
        { label: t('rfidReaders'), href: '/products' },
        { label: t('rfidTags'), href: '/products' },
      ],
    },
    {
      label: t('applications'),
      href: '/applications',
      children: appCategories.length > 0
        ? appCategories.map(cat => ({
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
