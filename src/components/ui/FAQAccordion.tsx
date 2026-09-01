"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  faqs: { _id?: string; question: string; answer: string }[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs?.length) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={faq._id || index}
          className="bg-white border border-cream-dark/50 rounded-xl overflow-hidden transition-all duration-300"
        >
          <button
            className="w-full flex items-center justify-between p-4 md:p-5 text-left"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-panel-${index}`}
          >
            <span className={`font-medium text-sm md:text-base ${openIndex === index ? "text-green" : "text-charcoal-dark"}`}>
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 text-green transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <div
              id={`faq-panel-${index}`}
              className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-charcoal-light leading-relaxed animate-fade-in"
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
