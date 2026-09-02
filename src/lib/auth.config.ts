import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible Auth.js configuration.
 *
 * This config is used by middleware which runs in Edge Runtime.
 * It does NOT import any Node.js-only modules (Prisma, bcrypt).
 *
 * The authorize function and Node.js-only providers are added
 * in auth.ts, which runs in the Node.js runtime.
 */
export const authConfig = {
  providers: [],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
