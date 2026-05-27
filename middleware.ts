// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth((req) => {
  const isLoggedIn = !!req.auth;
  const nextUrl = req.nextUrl;

  if (
    !isLoggedIn &&
    (nextUrl.pathname.startsWith("/fiokom") ||
      nextUrl.pathname.startsWith("/rendelesek"))
  ) {
    const newUrl = new URL("/belepes", nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (
    nextUrl.pathname.startsWith("/admin") &&
    nextUrl.pathname !== "/admin-login"
  ) {
    const userRole = req.auth?.user?.role;
    if (!isLoggedIn || userRole !== "admin") {
      const newUrl = new URL("/belepes", nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }
});

export const config = {
  matcher: ["/fiokom/:path*", "/rendelesek"],
};
