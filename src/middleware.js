import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl; // Extract the current path
  const token = request.cookies.get("authToken");

  // Allow access to the login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login page if token is missing
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all /admin routes
};
