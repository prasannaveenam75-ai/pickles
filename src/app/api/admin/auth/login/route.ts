import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/lib/models";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({ email: admin.email, role: admin.role, id: admin._id.toString() });

    const response = NextResponse.json({
      success: true,
      data: { token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } },
    });

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
