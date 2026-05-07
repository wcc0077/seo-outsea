import GenericPage from '@/components/sections/GenericPage';

export default async function SupportPage(props: { params: Promise<{ locale: string }> }) {
  return <GenericPage {...props} slug="support" />;
}
