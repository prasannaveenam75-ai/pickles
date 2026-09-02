import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export default function SweetsSection({ products, title, subtitle }: { products: any[]; title?: string; subtitle?: string }) {
  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-20 bg-warm-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-golden-dark font-display text-xs tracking-[0.25em] uppercase">From Our Kitchen</p>
          <h2 className="section-title mt-2">{title || "Traditional Sweets"}</h2>
          <p className="section-subtitle">{subtitle || "Authentic Andhra sweets made with pure ghee and jaggery."}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop" className="btn-secondary">
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}
