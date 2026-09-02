"use client";

import { Leaf, ShieldCheck, Heart, Sparkles, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  leaf: Leaf,
  shield: ShieldCheck,
  heart: Heart,
  check: Sparkles,
};

interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

export default function TrustStrip({ items }: { items: TrustItem[] }) {
  const elements = items?.length ? items : [
    { icon: "leaf", title: "100% Natural", description: "Made with natural ingredients." },
    { icon: "shield", title: "No Preservatives", description: "Freshly prepared in small batches." },
    { icon: "heart", title: "Homemade Taste", description: "Traditional recipes and love." },
    { icon: "check", title: "Quality Ingredients", description: "Carefully sourced and hygienic." },
  ];

  return (
    <section className="bg-maroon text-white">
      <div className="container-custom mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center overflow-x-auto gap-6 md:gap-0 md:justify-between scrollbar-hide">
          {elements.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <div key={item.title} className="flex items-center gap-3 flex-shrink-0 md:flex-1 px-2">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-golden">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wide text-white whitespace-nowrap">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-[10px] md:text-xs hidden sm:block whitespace-nowrap">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 md:hidden ml-2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
