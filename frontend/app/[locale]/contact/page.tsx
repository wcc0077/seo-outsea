import ContactMap from '@/components/sections/ContactMap';
import ContactForm from '@/components/sections/ContactForm';

export default async function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-primary-950 to-neutral-900 text-white py-24 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full border border-primary-500/10" />
            <div className="absolute inset-12 rounded-full border border-primary-500/8" />
            <div className="absolute inset-24 rounded-full border border-primary-500/5" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-0.5 bg-primary-400 mx-auto mb-8" />
          <h1 className="text-4xl font-bold mb-5">Contact Us</h1>
          <p className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
            Get in touch with our team for product inquiries, technical support, or partnership opportunities.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
      </section>

      {/* Map & Offices */}
      <ContactMap />

      {/* Contact Form */}
      <ContactForm />
    </>
  );
}
