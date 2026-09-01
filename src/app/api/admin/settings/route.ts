import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    const settings = await SiteSettings.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
