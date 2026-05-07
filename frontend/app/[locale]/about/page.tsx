import GenericPage from '@/components/sections/GenericPage';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  return <GenericPage {...props} slug="about" />;
}
