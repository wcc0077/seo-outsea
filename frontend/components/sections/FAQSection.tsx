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
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">{title}</h2>
        )}
        <dl className="space-y-4">
          {faqs.map((faq, index) => (
            <dt key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div
                  className="px-4 pb-4 text-gray-600 prose prose-sm max-w-none"
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
