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

  // Deduplicate categories by slug to handle Strapi i18n duplicates
  const seen = new Set<string>();
  const uniqueCategories = categories.filter(cat => {
    if (seen.has(cat.slug)) return false;
    seen.add(cat.slug);
    return true;
  });

  // Default to first category (smart-manufacturing)
  const defaultCategory = uniqueCategories.length > 0 ? uniqueCategories[0].slug : null;

  return (
    <ApplicationsPageClient
      applications={applications}
      categories={uniqueCategories}
      defaultCategory={defaultCategory}
      locale={locale}
    />
  );
}
