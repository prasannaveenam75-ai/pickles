import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const sort = searchParams.get("sort") || "createdAt";
    const active = searchParams.get("active");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (bestSeller === "true") filter.bestSeller = true;
    if (active !== null && active !== undefined) filter.active = active === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj: Record<string, 1 | -1> = {};
    switch (sort) {
      case "price_asc": sortObj = { "variants.price": 1 }; break;
      case "price_desc": sortObj = { "variants.price": -1 }; break;
      case "name": sortObj = { name: 1 }; break;
      case "featured": sortObj = { featured: -1, createdAt: -1 }; break;
      case "bestSeller": sortObj = { bestSeller: -1, createdAt: -1 }; break;
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
    console.error("Products GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, message: "Name and category are required" }, { status: 400 });
    }

    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");
    }

    const existing = await Product.findOne({ slug: body.slug });
    if (existing) {
      body.slug = body.slug + "-" + Date.now();
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Product POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
