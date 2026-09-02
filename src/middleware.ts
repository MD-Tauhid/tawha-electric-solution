import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

/**
 * Create Edge-compatible auth instance for middleware.
 *
 * This does NOT import Prisma, bcrypt, or any other Node.js-only
 * modules. It only verifies JWT tokens.
 */
const { auth } = NextAuth(authConfig);

/**
 * Middleware to protect admin routes.
 *
 * - Unauthenticated users are redirected to /admin/login
 * - Authenticated users trying to access /admin/login are redirected to /admin
 */
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isOnLogin = pathname === "/admin/login";
  const isOnAdmin = pathname.startsWith("/admin");

  // Redirect logged-in users away from the login page
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }

  // Protect all admin routes except login
  if (isOnAdmin && !isOnLogin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
