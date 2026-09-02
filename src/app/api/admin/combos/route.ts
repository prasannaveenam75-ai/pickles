import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Combo } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const combos = await Combo.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: combos });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const combo = await Combo.create(body);
  return NextResponse.json({ success: true, data: combo }, { status: 201 });
}