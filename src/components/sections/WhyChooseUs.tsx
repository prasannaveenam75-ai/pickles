import { BookOpen, Star, Home, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  book: BookOpen,
  star: Star,
  home: Home,
  shield: ShieldCheck,
  zap: Zap,
  check: CheckCircle2,
};

interface WhyItem {
  title: string;
  description: string;
  icon: string;
}

export default function WhyChooseUs({ title, items }: { title: string; items: WhyItem[] }) {
  const defaultItems = [
    { title: "AUTHENTIC RECIPES", description: "Traditional recipes and familiar flavours.", icon: "book" },
    { title: "QUALITY INGREDIENTS", description: "Carefully selected ingredients.", icon: "star" },
    { title: "HOMEMADE TASTE", description: "Prepared with the warmth of traditional cooking.", icon: "home" },
    { title: "HYGIENICALLY PREPARED", description: "Prepared and packed with care.", icon: "shield" },
    { title: "FRESH & FLAVOURFUL", description: "Made to preserve authentic taste.", icon: "zap" },
    { title: "QUALITY YOU CAN TRUST", description: "Consistency and care in every product.", icon: "check" },
  ];
  const chosen = items?.length ? items : defaultItems;

  return (
    <section className="section-padding bg-white">
      <div className="container-custom mx-auto">
        <h2 className="section-title">{title || "WHY CHOOSE DEVI PICKLES?"}</h2>
        <p className="section-subtitle">Every jar is a promise of quality, taste and tradition.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {chosen.map((item) => {
            const Icon = iconMap[item.icon] || CheckCircle2;
            return (
              <div key={item.title} className="group p-6 bg-cream rounded-xl border border-cream-dark/30 hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 rounded-full bg-green/10 flex items-center justify-center text-green mb-4 group-hover:bg-green group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-charcoal-dark mb-2 uppercase text-sm">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
