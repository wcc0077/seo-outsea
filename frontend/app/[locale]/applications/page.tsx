import { getApplications, getApplicationCategories, ApplicationData, ApplicationCategoryData } from '@/lib/strapi';
import ApplicationsPageClient from './ApplicationsPageClient';

interface ApplicationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ApplicationsPage({ params }: ApplicationsPageProps) {
  const { locale } = await params;

  const [applications, categories] = await Promise.all([
    getApplications(locale).catch(() => []),
    getApplicationCategories(locale).catch(() => []),
  ]);

  return (
    <ApplicationsPageClient
      applications={applications}
      categories={categories}
      locale={locale}
    />
  );
}
