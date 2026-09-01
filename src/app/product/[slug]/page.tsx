import StorefrontLayout from "@/components/layout/StorefrontLayout";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Testimonial } from "@/lib/models";
import { notFound } from "next/navigation";
import { serialize } from "@/lib/utils/serialize";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).select("slug").lean();
    return products.map((p: any) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug }).lean();
    return {
      title: product?.seoTitle || `${product?.name || "Product"} | Devi Pickles`,
      description: product?.seoDescription || product?.shortDescription || "",
    };
  } catch {
    return { title: "Product | Devi Pickles", description: "" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any, related: any, testimonials: any = [];
  try {
    await connectToDatabase();
    product = await Product.findOne({ slug, active: true }).lean();
    if (!product) notFound();
    related = await Product.find({
      category: (product as any).category,
      _id: { $ne: product._id },
      active: true,
    }).limit(4).lean();
    testimonials = await Testimonial.find({
      productId: (product as any)._id,
      active: true,
    }).sort({ displayOrder: 1, createdAt: -1 }).limit(4).lean();
  } catch {
    related = [];
    if (!product) notFound();
  }

  return (
    <StorefrontLayout>
      <ProductDetailClient
        product={serialize(product)}
        related={serialize(related || [])}
        testimonials={serialize(testimonials || [])}
      />
    </StorefrontLayout>
  );
}
