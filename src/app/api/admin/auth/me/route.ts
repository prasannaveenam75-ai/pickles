import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/lib/models";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();
    const admin = await Admin.findById(payload.id).select("-password").lean();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: admin });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
