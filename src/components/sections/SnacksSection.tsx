import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function SnacksSection({ products }: { products: any[] }) {
  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-20 bg-cream">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-golden-dark font-display text-xs tracking-[0.25em] uppercase">Crunchy Goodness</p>
          <h2 className="section-title mt-2">Traditional Snacks</h2>
          <p className="section-subtitle">Crispy murukulu, chekkalu and more — straight from the kadai.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop?category=Snacks" className="btn-secondary">
            View All Snacks
          </Link>
        </div>
      </div>
    </section>
  );
}