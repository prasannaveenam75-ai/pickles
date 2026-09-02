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
    { icon: "leaf", title: "100% NATURAL", description: "Made with natural ingredients." },
    { icon: "shield", title: "NO ARTIFICIAL COLOURS", description: "Authentic colours from real ingredients." },
    { icon: "heart", title: "HOMEMADE TASTE", description: "Traditional recipes and care." },
    { icon: "check", title: "HYGIENICALLY PREPARED", description: "Packed with high standards of hygiene." },
  ];

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {elements.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-veg/10 flex items-center justify-center text-veg">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal-dark">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-charcoal-light mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
