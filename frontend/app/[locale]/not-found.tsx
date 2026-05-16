import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFoundPage() {
  const t = await getTranslations({ locale: 'en', namespace: 'NotFound' });

  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-8" />
        <h1 className="text-8xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-xl text-neutral-500 mb-10">{t('title')}</p>
        <Link href="/en" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}