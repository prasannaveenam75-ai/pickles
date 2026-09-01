import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json({ success: false, message: "Name, phone and message are required" }, { status: 400 });
    }

    console.log("Contact form submission:", { name, phone, email, message });

    return NextResponse.json({ success: true, message: "Thank you for your message. We will get back to you soon." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
