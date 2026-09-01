import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");

    const filter: Record<string, unknown> = { active: true };
    if (type === "written" || type === "instagram" || type === "uploaded") {
      filter.type = type;
    }
    if (featured === "true") filter.featured = true;

    const testimonials = await Testimonial.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: testimonials, count: testimonials.length });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}