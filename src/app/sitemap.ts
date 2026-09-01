import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/lib/models";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/shop`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
    { url: `${SITE_URL}/faq`, lastModified: new Date() },
    { url: `${SITE_URL}/shipping-policy`, lastModified: new Date() },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date() },
    { url: `${SITE_URL}/terms`, lastModified: new Date() },
    { url: `${SITE_URL}/refund-policy`, lastModified: new Date() },
    { url: `${SITE_URL}/track-order`, lastModified: new Date() },
  ];

  try {
    await connectToDatabase();
    const [products, categories] = await Promise.all([
      Product.find({ active: true }).select("slug updatedAt").lean(),
      Category.find({ active: true }).select("slug updatedAt").lean(),
    ]);

    const productUrls = products.map((p: any) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt,
    }));

    const categoryUrls = categories.map((c: any) => ({
      url: `${SITE_URL}/shop/${c.slug}`,
      lastModified: c.updatedAt,
    }));

    return [...staticUrls, ...productUrls, ...categoryUrls];
  } catch {
    return staticUrls;
  }
}
