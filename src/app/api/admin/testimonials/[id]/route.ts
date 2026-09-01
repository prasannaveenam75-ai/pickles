import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";
import { extractInstagramCode, isValidInstagramTestimonialUrl } from "@/lib/utils/testimonial";
import { isValidObjectId } from "mongoose";

function normalizePartial(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  const type = body.type;
  if (type === "written" || type === "instagram" || type === "uploaded") data.type = type;

  if (body.customerName !== undefined) data.customerName = String(body.customerName || "").trim();
  if (body.customerLocation !== undefined) data.customerLocation = String(body.customerLocation || "").trim();
  if (body.customerImage !== undefined) data.customerImage = String(body.customerImage || "").trim();
  if (body.productId !== undefined) data.productId = body.productId ? String(body.productId) : "";
  if (body.productName !== undefined) data.productName = String(body.productName || "").trim();
  if (body.rating !== undefined) data.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  if (body.reviewText !== undefined) data.reviewText = String(body.reviewText || "").trim();
  if (body.caption !== undefined) data.caption = String(body.caption || "").trim();
  if (body.videoUrl !== undefined) data.videoUrl = String(body.videoUrl || "").trim();
  if (body.thumbnailUrl !== undefined) data.thumbnailUrl = String(body.thumbnailUrl || "").trim();
  if (body.videoPublicId !== undefined) data.videoPublicId = String(body.videoPublicId || "").trim();
  if (body.videoDuration !== undefined) data.videoDuration = body.videoDuration ? Number(body.videoDuration) : undefined;
  if (body.videoAspect !== undefined) data.videoAspect = String(body.videoAspect || "").trim();
  if (body.displayOrder !== undefined) data.displayOrder = Number(body.displayOrder) || 0;

  for (const flag of ["verified", "featured", "active", "isDemo"] as const) {
    if (body[flag] !== undefined) data[flag] = Boolean(body[flag]);
  }

  if (body.instagramUrl !== undefined) {
    const instagramUrl = String(body.instagramUrl || "").trim();
    if (instagramUrl && !isValidInstagramTestimonialUrl(instagramUrl)) {
      return { error: "Please enter a valid Instagram post or Reel URL." };
    }
    data.instagramUrl = instagramUrl;
    data.instagramCode = instagramUrl ? extractInstagramCode(instagramUrl) || "" : "";
  }

  return { error: null as string | null, data };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid testimonial id" }, { status: 400 });
    }
    await connectToDatabase();
    const doc = await Testimonial.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("Admin testimonial GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid testimonial id" }, { status: 400 });
    }
    const body = await request.json();
    const normalized = normalizePartial(body);
    if (normalized.error) {
      return NextResponse.json({ success: false, message: normalized.error }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await Testimonial.findByIdAndUpdate(id, { $set: normalized.data }, { new: true, runValidators: true });
    if (!doc) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("Admin testimonial PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid testimonial id" }, { status: 400 });
    }
    await connectToDatabase();
    const doc = await Testimonial.findByIdAndDelete(id);
    if (!doc) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("Admin testimonial DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}