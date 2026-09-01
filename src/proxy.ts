import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dev-secret");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/api/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminPage || isAdminLogin) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("admin-token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};