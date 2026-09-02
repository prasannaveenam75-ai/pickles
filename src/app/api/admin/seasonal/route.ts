import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SeasonalCollection } from "@/lib/models";

export async function GET() {
  await connectToDatabase();
  const collections = await SeasonalCollection.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
  return NextResponse.json({ success: true, data: collections });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const collection = await SeasonalCollection.create(body);
  return NextResponse.json({ success: true, data: collection }, { status: 201 });
}