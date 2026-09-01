import StorefrontLayout from "@/components/layout/StorefrontLayout";
import ProductGrid from "@/components/ui/ProductGrid";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/lib/models";
import { notFound } from "next/navigation";
import { serialize } from "@/lib/utils/serialize";

export const revalidate = 300;

export async function generateStaticParams() {
  await connectToDatabase();
  const categories = await Category.find({ active: true }).lean();
  return categories.map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const category = await Category.findOne({ slug }).lean();
  return {
    title: category?.seoTitle || `${category?.name || "Category"} | Devi Pickles`,
    description: category?.seoDescription || category?.description || "",
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const category = await Category.findOne({ slug }).lean();
  if (!category || !category.active) notFound();

  const products = await Product.find({ category: category.name, active: true }).lean();

  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-14 md:py-16">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">
            {category.name.toUpperCase()}
          </h1>
          {category.description && (
            <p className="text-cream/80 max-w-xl mx-auto">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <ProductGrid
            products={serialize(products)}
          />
        ) : (
          <div className="text-center py-16">
            <h3 className="font-display text-xl font-bold text-charcoal mb-2">No products available</h3>
            <p className="text-charcoal-light">New products are coming soon.</p>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
