import { NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

export interface AdminPayload {
  email: string;
  role: string;
  id: string;
}

export async function requireAdmin(request: Request): Promise<AdminPayload | NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return payload;
}

export function isAdminResponse(value: AdminPayload | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}