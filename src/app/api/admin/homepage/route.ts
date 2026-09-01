import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Homepage } from "@/lib/models";
import { requireAdmin, isAdminResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    let homepage = await Homepage.findOne().lean();
    if (!homepage) {
      homepage = await Homepage.create({});
    }
    return NextResponse.json({ success: true, data: homepage });
  } catch (error) {
    console.error("Homepage GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (isAdminResponse(auth)) return auth;
    await connectToDatabase();
    const body = await request.json();
    const homepage = await Homepage.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });
    return NextResponse.json({ success: true, data: homepage });
  } catch (error) {
    console.error("Homepage PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
