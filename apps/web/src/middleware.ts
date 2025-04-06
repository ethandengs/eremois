import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of paths that require authentication
const protectedPaths = ["/dashboard"];

// List of paths that should redirect to dashboard if user is authenticated
const authPaths = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(pathname) && token) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [...protectedPaths, ...authPaths],
};
