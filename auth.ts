// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user }) {
      if (user.email) {
        try {
          const { initUserInDatabase } = await import("@/lib/handleUserLogin");
          await initUserInDatabase(user);
          return true;
        } catch (error) {
          console.error("Adatbázis hiba Google bejelentkezés során:", error);
          return false;
        }
      }
      return false;
    },

    async jwt({ token }) {
      if (token?.email) {
        try {
          const { getUserByEmail } = await import("@/lib/handleUserLogin");
          const dbUser = await getUserByEmail(token.email);

          if (dbUser) {
            token.userId = dbUser.userId;
            token.role = dbUser.role || "user";
          }
        } catch (error) {
          console.error("JWT hiba Google bejelentkezés során:", error);
        }
      }
      return token;
    },
  },
});
