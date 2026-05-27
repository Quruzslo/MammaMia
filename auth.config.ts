// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60, // 2 nap
    updateAge: 1 * 60 * 60, // 1 óra
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
