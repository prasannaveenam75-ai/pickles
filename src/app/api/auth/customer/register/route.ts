import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, phone and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Customer.findOne({
      $or: [{ email: normalizedEmail }, { phone }],
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "An account with this email or phone already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const customer = await Customer.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      totalOrders: 0,
      totalSpent: 0,
    });

    const token = await createToken({
      email: customer.email,
      role: "customer",
      id: customer._id.toString(),
    });

    const response = NextResponse.json({
      success: true,
      data: {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      },
    });

    response.cookies.set("customer-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "An account with this email or phone already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
