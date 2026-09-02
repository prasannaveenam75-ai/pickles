import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function SnacksSection({ products, title, subtitle }: { products: any[]; title?: string; subtitle?: string }) {
  if (!products?.length) return null;

  return (
    <section className="py-10 md:py-16 bg-cream">
      <div className="container-custom mx-auto px-4">
        <SectionHeader
          eyebrow="From Our Kitchen"
          title={title || "Traditional Snacks"}
          subtitle={subtitle || "Crispy treats made with traditional recipes."}
          align="center"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/shop" className="btn-secondary">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
