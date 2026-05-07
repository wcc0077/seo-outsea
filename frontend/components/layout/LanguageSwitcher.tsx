'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SUPPORTED_LOCALES } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  zh: '中文',
};

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
        className="text-sm border border-neutral-700 rounded-md px-2 py-1 bg-neutral-800 text-neutral-300 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Select language"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_NAMES[locale] || locale}
          </option>
        ))}
      </select>
    </div>
  );
}
