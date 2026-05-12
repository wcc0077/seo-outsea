'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { ProductCategoryData, ProductData, ApplicationCategoryData, RfidTagData } from '@/lib/strapi';

interface HeaderWrapperProps {
  siteName: string;
  logoUrl: string | null;
  navLinks: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  locale: string;
  productCategories: ProductCategoryData[];
  products: ProductData[];
  appCategories: ApplicationCategoryData[];
  rfidTags: RfidTagData[];
}

export default function HeaderWrapper(props: HeaderWrapperProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/' || pathname === '/en' || pathname === '/zh';

  return <Header {...props} noBorder={isHomepage} />;
}
