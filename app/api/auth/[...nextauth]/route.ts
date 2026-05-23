import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// 1. Létrehozzuk a konfigurációt
const { handlers } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

// 2. Azonnal exportáljuk is a GET és POST kéréseket a Next.js-nek
export const { GET, POST } = handlers;
