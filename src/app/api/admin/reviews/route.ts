import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";

    const filter: Record<string, unknown> = {};
    if (publicOnly) filter.published = true;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    const review = await Review.create(body);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
