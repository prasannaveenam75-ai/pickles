import type { IProduct } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FeaturedProducts({ products }: { products: IProduct[] }) {
  if (!products?.length) return null;

  return (
    <section className="py-10 md:py-16 bg-cream-dark/20">
      <div className="container-custom mx-auto px-4">
        <SectionHeader
          title="Featured Delicacies"
          subtitle="Handpicked favourites, prepared with love."
          align="center"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
