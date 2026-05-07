import GenericPage from '@/components/sections/GenericPage';

export default async function SharingPage(props: { params: Promise<{ locale: string }> }) {
  return <GenericPage {...props} slug="sharing" />;
}
