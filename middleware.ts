import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.GEO_ADMIN_SECRET || "dev-secret-change-in-production";
const COOKIE_NAME = "geo-admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = JSON.parse(atob(token));
    const isValid =
      payload.secret === ADMIN_SECRET &&
      payload.expiresAt > Date.now();

    if (!isValid) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
