import GenericPage from '@/components/sections/GenericPage';

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  return <GenericPage {...props} slug="contact" />;
}
