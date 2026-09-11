// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";
import clientPromise from "./lib/mongodb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    ...authConfig.providers,

    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const client = await clientPromise;
          const db = client.db("MammaMia");

          const admin = await db.collection("admins").findOne({
            email: credentials.email,
          });

          if (!admin) {
            throw new Error("Hibás email vagy jelszó!");
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            admin.password,
          );

          if (!isValid) {
            throw new Error("Hibás email vagy jelszó!");
          }

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          };
        } catch (error) {
          console.error("Szerveroldali login hiba:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

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
      // Admin login
      if (account?.provider === "credentials" && user) {
        token.userId = user.id ?? null;
        token.role = user.role ?? "admin";
        return token;
      }

      // Google login
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
  },
});
