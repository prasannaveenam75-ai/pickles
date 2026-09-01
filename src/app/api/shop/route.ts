import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "createdAt";

    const filter: Record<string, unknown> = { active: true };
    if (slug) filter.slug = slug;
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (bestSeller === "true") filter.bestSeller = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = {};
    switch (sort) {
      case "price_asc": sortObj = { "variants.price": 1 }; break;
      case "price_desc": sortObj = { "variants.price": -1 }; break;
      case "name": sortObj = { name: 1 }; break;
      case "featured": sortObj = { featured: -1, bestSeller: -1, createdAt: -1 }; break;
      default: sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Shop products error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
