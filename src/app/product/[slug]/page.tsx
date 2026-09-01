import StorefrontLayout from "@/components/layout/StorefrontLayout";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { notFound } from "next/navigation";
import { serialize } from "@/lib/utils/serialize";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  await connectToDatabase();
  const products = await Product.find({}).select("slug").lean();
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const product = await Product.findOne({ slug }).lean();
  return {
    title: product?.seoTitle || `${product?.name || "Product"} | Devi Pickles`,
    description: product?.seoDescription || product?.shortDescription || "",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();

  const product = await Product.findOne({ slug, active: true }).lean();
  if (!product) notFound();

  const related = await Product.find({
    category: (product as any).category,
    _id: { $ne: product._id },
    active: true,
  }).limit(4).lean();

  return (
    <StorefrontLayout>
      <ProductDetailClient
        product={serialize(product)}
        related={serialize(related)}
      />
    </StorefrontLayout>
  );
}
