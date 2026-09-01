import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: true,
        data: { url: `/placeholder-product.svg`, publicId: "placeholder" },
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([buffer], { type: file.type }), file.name);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", timestamp.toString());
    uploadForm.append("signature", signature);
    uploadForm.append("folder", "devi-pickles");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadForm,
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: { url: data.secure_url, publicId: data.public_id },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
