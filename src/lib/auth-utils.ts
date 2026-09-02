import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Get the current user's session.
 * Returns null if not authenticated.
 */
export async function getCurrentSession() {
  const session = await auth();
  return session;
}

/**
 * Require authentication. Redirects to login if not authenticated.
 * Use in Server Components and Server Actions that require a logged-in user.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * Require admin role. Redirects to login if not authenticated
 * or returns the session if the user has the ADMIN role.
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return session;
}
