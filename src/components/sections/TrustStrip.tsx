"use client";

import { Leaf, ShieldCheck, Heart, Sparkles } from "lucide-react";

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
    { icon: "leaf", title: "No Palm Oil", description: "Prepared with healthy, natural oils." },
    { icon: "shield", title: "No Preservatives", description: "Pure, freshly made goodness." },
    { icon: "check", title: "No Added Colors", description: "Natural colour from real ingredients." },
  ];

  return (
    <section className="bg-maroon-dark text-white overflow-hidden py-3">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(3)].map((_, block) => (
          <span key={block} className="inline-flex items-center">
            {elements.map((item) => {
              const Icon = iconMap[item.icon] || Leaf;
              return (
                <span key={`${block}-${item.title}`} className="inline-flex items-center gap-2.5 px-6 text-[11px] md:text-sm font-semibold uppercase tracking-wide">
                  <Icon className="w-4 h-4 text-golden" />
                  {item.title}
                  <span className="mx-4 text-white/30">•</span>
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </section>
  );
}
