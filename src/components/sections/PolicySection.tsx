import Link from "next/link";
import { PackageX } from "lucide-react";

interface PolicyBlock {
  heading?: string;
  unboxingDisclaimer?: string;
  cancellationHeading?: string;
  cancellationText?: string;
  returnHeading?: string;
  returnText?: string;
  refundHeading?: string;
  refundText?: string;
  policyNote?: string;
}

export default function PolicySection({ policies }: { policies?: PolicyBlock }) {
  const p = policies || {};

  const cards = [
    {
      title: p.cancellationHeading || "NO CANCELLATION",
      text: p.cancellationText || "Orders cannot be cancelled once processing or dispatch has started.",
    },
    {
      title: p.returnHeading || "NO RETURN",
      text: p.returnText || "Food products are not eligible for return due to hygiene and food-safety considerations.",
    },
    {
      title: p.refundHeading || "NO REFUND",
      text: p.refundText || "Refunds are provided only for approved cases such as damaged, missing or incorrect items as per the store policy.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-golden-dark font-display text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold">
            Please Read Carefully
          </p>
          <h2 className="section-title mt-1 md:mt-2">{p.heading || "ORDER POLICY"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center p-6 md:p-8 bg-cream/60 rounded-2xl border border-sand-dark/20 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center text-red mb-4">
                <PackageX className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base md:text-lg font-bold text-charcoal-dark uppercase mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-charcoal-light mt-8 md:mt-10 max-w-xl mx-auto">
          {p.policyNote || "Please review our complete policy before placing your order."}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          <Link href="/shipping-policy" className="text-xs md:text-sm font-bold text-maroon hover:text-maroon-light uppercase tracking-wider underline-offset-4 hover:underline">
            Shipping Policy
          </Link>
          <span className="text-charcoal-light/40">•</span>
          <Link href="/refund-policy" className="text-xs md:text-sm font-bold text-maroon hover:text-maroon-light uppercase tracking-wider underline-offset-4 hover:underline">
            Refund Policy
          </Link>
          <span className="text-charcoal-light/40">•</span>
          <Link href="/terms" className="text-xs md:text-sm font-bold text-maroon hover:text-maroon-light uppercase tracking-wider underline-offset-4 hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </section>
  );
}
