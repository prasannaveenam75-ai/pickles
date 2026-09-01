import StorefrontLayout from "@/components/layout/StorefrontLayout";
import ProductGrid from "@/components/ui/ProductGrid";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/lib/models";
import { serialize } from "@/lib/utils/serialize";
import ShopControls from "./ShopControls";

export const revalidate = 300;

export const metadata = {
  title: "Shop All Pickles & Powders",
  description: "Browse our full collection of authentic homemade pickles and powders. Veg pickles, non-veg pickles and traditional powders.",
};

export default async function ShopPage() {
  await connectToDatabase();

  const [products, categories] = await Promise.all([
    Product.find({ active: true }).sort({ featured: -1, createdAt: -1 }).lean(),
    Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
  ]);

  return (
    <StorefrontLayout>
      <div className="bg-green-dark text-white py-14 md:py-16">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3">SHOP ALL PICKLES & POWDERS</h1>
          <p className="text-cream/80 max-w-xl mx-auto">
            Explore our complete collection of authentic homemade delicacies.
          </p>
        </div>
      </div>

      <ShopControls products={serialize(products)} categories={serialize(categories)} />
    </StorefrontLayout>
  );
}
