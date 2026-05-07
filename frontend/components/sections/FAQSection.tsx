'use client';

import { useState } from 'react';

interface FAQSectionProps {
  title?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export default function FAQSection({ title, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-14">
            <div className="w-12 h-0.5 bg-primary-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
          </div>
        )}
        <dl className="space-y-4">
          {faqs.map((faq, index) => (
            <dt key={index} className="border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-primary-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div
                  className="px-5 pb-5 text-neutral-600 prose prose-sm max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              )}
            </dt>
          ))}
        </dl>
      </div>
    </section>
  );
}
