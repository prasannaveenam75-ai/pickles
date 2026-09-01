import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Testimonial } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";
import { extractInstagramCode, isValidInstagramTestimonialUrl } from "@/lib/utils/testimonial";

const TESTIMONIAL_TYPES = ["written", "instagram", "uploaded"];

type TestimonialInput = {
  type: string;
  customerName: string;
  customerLocation: string;
  customerImage: string;
  productId: string;
  productName: string;
  rating: number;
  reviewText: string;
  instagramUrl: string;
  instagramCode: string;
  videoUrl: string;
  thumbnailUrl: string;
  videoPublicId: string;
  videoDuration?: number;
  videoAspect: string;
  caption: string;
  verified: boolean;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  isDemo: boolean;
};

function normalizeBody(body: Record<string, unknown>): { error: string | null; data: TestimonialInput } {
  const type = TESTIMONIAL_TYPES.includes(body.type as string) ? (body.type as string) : "written";
  let instagramUrl = "";
  if (type === "instagram" && typeof body.instagramUrl === "string") {
    instagramUrl = body.instagramUrl.trim();
  }

  return {
    error:
      type === "instagram" && !isValidInstagramTestimonialUrl(instagramUrl)
        ? "Please enter a valid Instagram post or Reel URL."
        : null,
    data: {
      type,
      customerName: String(body.customerName || "").trim(),
      customerLocation: String(body.customerLocation || "").trim(),
      customerImage: String(body.customerImage || "").trim(),
      productId: body.productId ? String(body.productId) : "",
      productName: String(body.productName || "").trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      reviewText: String(body.reviewText || "").trim(),
      instagramUrl: instagramUrl || String(body.instagramUrl || "").trim(),
      instagramCode: instagramUrl ? extractInstagramCode(instagramUrl) || "" : "",
      videoUrl: String(body.videoUrl || "").trim(),
      thumbnailUrl: String(body.thumbnailUrl || "").trim(),
      videoPublicId: String(body.videoPublicId || "").trim(),
      videoDuration: body.videoDuration ? Number(body.videoDuration) : undefined,
      videoAspect: String(body.videoAspect || "").trim(),
      caption: String(body.caption || "").trim(),
      verified: Boolean(body.verified),
      featured: Boolean(body.featured),
      active: Boolean(body.active),
      displayOrder: Number(body.displayOrder) || 0,
      isDemo: Boolean(body.isDemo),
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "all";
    const filter: Record<string, unknown> = {};
    if (tab === "written") filter.type = "written";
    if (tab === "instagram") filter.type = "instagram";
    if (tab === "uploaded") filter.type = "uploaded";
    if (tab === "featured") filter.featured = true;
    if (tab === "active") filter.active = true;
    if (tab === "inactive") filter.active = false;
    if (tab === "pending") filter.active = false;

    const testimonials = await Testimonial.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Admin testimonials GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    const body = await request.json();
    const normalized = normalizeBody(body);
    if (normalized.error) {
      return NextResponse.json({ success: false, message: normalized.error }, { status: 400 });
    }
    if (!normalized.data.customerName) {
      return NextResponse.json({ success: false, message: "Customer name is required." }, { status: 400 });
    }
    if (normalized.data.type === "instagram" && !normalized.data.instagramCode) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid Instagram post or Reel URL." },
        { status: 400 }
      );
    }
    if (normalized.data.type === "uploaded" && !normalized.data.videoUrl) {
      return NextResponse.json(
        { success: false, message: "Please upload a video or provide a video URL." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const doc = await Testimonial.create(normalized.data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    console.error("Admin testimonial POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}