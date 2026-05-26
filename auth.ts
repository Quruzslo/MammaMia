// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 24 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const { initUserInDatabase } = await import("@/lib/handleUserLogin");
          await initUserInDatabase(user);
          return true;
        } catch (error) {
          console.error("Adatbázis hiba:", error);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, user }) {
      // Csak első bejelentkezéskor fut le a `user` objektummal,
      // utána már csak a token-ből dolgozunk.
      if (user?.email && !token.userId) {
        try {
          const { getUserByEmail } = await import("@/lib/handleUserLogin");
          const dbUser = await getUserByEmail(user.email);
          token.userId = dbUser?.userId ?? null;
        } catch (error) {
          console.error("JWT hiba:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId as string;
      }
      return session;
    },
  },
});
