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
    { title: "No Added Colours", description: "Authentic colours from real ingredients.", icon: "check" },
    { title: "No Preservatives", description: "Freshly prepared in small batches.", icon: "shield" },
    { title: "Fresh Ingredients", description: "Carefully selected from trusted sources.", icon: "star" },
    { title: "Homemade Taste", description: "Traditional recipes and familiar flavours.", icon: "home" },
    { title: "Quality Ingredients", description: "Only the finest, natural ingredients.", icon: "book" },
    { title: "Hygienic Preparation", description: "Prepared and packed with care.", icon: "zap" },
  ];
  const chosen = items?.length ? items : defaultItems;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="section-title">{title || "Why Choose Devi Pickles?"}</h2>
          <p className="section-subtitle">Every jar is a promise of quality, taste and tradition.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {chosen.map((item) => {
            const Icon = iconMap[item.icon] || CheckCircle2;
            return (
              <div key={item.title} className="flex items-center gap-3 p-4 bg-cream rounded-2xl hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-veg/10 flex items-center justify-center text-veg flex-shrink-0 group-hover:bg-veg group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-charcoal-dark text-sm md:text-base leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-charcoal-light leading-snug hidden sm:block">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
