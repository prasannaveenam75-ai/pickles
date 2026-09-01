import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { FAQ } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";

    const filter: Record<string, unknown> = {};
    if (publicOnly) filter.active = true;

    const faqs = await FAQ.find(filter).sort({ displayOrder: 1 }).lean();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error("FAQ GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    console.error("FAQ POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
