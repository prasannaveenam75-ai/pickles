import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

const ALLOWED_VIDEO_TYPES = new Map<string, string>([
  ["video/mp4", "mp4"],
  ["video/quicktime", "mov"],
  ["video/webm", "webm"],
]);
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED_VIDEO_TYPES.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { success: false, message: "Please upload an MP4, MOV or WebM video." },
        { status: 400 }
      );
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { success: false, message: "Video is too large. Maximum allowed size is 100 MB." },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        message: "Video upload is not configured. Set Cloudinary credentials or paste a video URL instead.",
      }, { status: 503 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Math.round(Date.now() / 1000);
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(`folder=devi-pickles/testimonials&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([buffer], { type: file.type }), file.name);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", timestamp.toString());
    uploadForm.append("signature", signature);
    uploadForm.append("folder", "devi-pickles/testimonials");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: "POST",
      body: uploadForm,
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Video upload failed" }, { status: 500 });
    }

    const data = await response.json();
    const videoUrl = data.secure_url || "";
    const duration = Number(data.duration) || 0;
    const width = Number(data.width) || 16;
    const height = Number(data.height) || 9;
    const aspect = height > 0 ? `${Math.round((width / height) * 100) >= 62 ? "9:16" : "16:9"}` : "16:9";
    const thumbnailUrl = videoUrl.replace(/\.[a-z0-9]+$/i, ".jpg");

    return NextResponse.json({
      success: true,
      data: {
        videoUrl,
        thumbnailUrl,
        videoPublicId: data.public_id || "",
        videoDuration: duration,
        videoAspect: aspect,
      },
    });
  } catch (error) {
    console.error("Testimonial video upload error:", error);
    return NextResponse.json({ success: false, message: "Video upload failed" }, { status: 500 });
  }
}