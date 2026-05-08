'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper(props: Omit<React.ComponentProps<typeof Header>, 'noBorder'>) {
  const pathname = usePathname();
  const isHomepage = pathname === '/' || pathname === '/en' || pathname === '/zh';

  return <Header {...props} noBorder={isHomepage} />;
}
