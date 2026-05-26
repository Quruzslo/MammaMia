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
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      // Google flow
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

    async jwt({ token, user, account }) {
      // Admin esetén a role és userId egyből az authorize()-ból jön (Tiszta JS, nincs 'as any')
      if (account?.provider === "credentials" && user) {
        token.userId = user.id ?? null;
        token.role = user.role ?? "admin";
        return token;
      }

      // Google flow – eredeti logika, role alapértelmezett "user"
      if (user?.email && !token.userId) {
        try {
          const { getUserByEmail } = await import("@/lib/handleUserLogin");
          const dbUser = await getUserByEmail(user.email);
          token.userId = dbUser?.userId ?? null;
          token.role = "user";
        } catch (error) {
          console.error("JWT hiba:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.userId = token.userId;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
