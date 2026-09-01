import Link from "next/link";
import FAQAccordion from "@/components/ui/FAQAccordion";

interface FAQSectionProps {
  faqs: { _id?: string; question: string; answer: string }[];
  compact?: boolean;
}

export default function FAQSection({ faqs, compact = false }: FAQSectionProps) {
  return (
    <section className={`py-20 bg-cream-dark/30 ${compact ? "py-12" : ""}`}>
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about our pickles and orders.</p>
        </div>
        <FAQAccordion faqs={faqs || []} />
        {!compact && (
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm font-semibold text-green hover:text-green-light uppercase tracking-wider">
              View All FAQs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
