import type { IProduct } from "@/types";
import CategoryCard from "@/components/ui/CategoryCard";

interface CategoriesSectionProps {
  categories: {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
  }[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories?.length) return null;

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title">Explore Our Flavours</h2>
          <p className="section-subtitle">Something delicious for every meal.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id || cat.slug}
              name={cat.name}
              slug={cat.slug}
              description={cat.description}
              image={cat.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
