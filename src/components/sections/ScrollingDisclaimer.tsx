import { Video } from "lucide-react";

interface ScrollingDisclaimerProps {
  text?: string;
}

export default function ScrollingDisclaimer({ text }: ScrollingDisclaimerProps) {
  const message =
    text ||
    "Please record a continuous unboxing video while opening your package to help us verify any transit damage, missing items or order-related issues.";

  return (
    <section className="bg-amber-600 overflow-hidden py-3 border-y border-amber-700/30" aria-label="Order opening policy">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[11px] md:text-sm tracking-wide font-semibold text-white px-6"
          >
            <Video className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
            {message}
            <span className="mx-6 text-amber-200">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
