// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth: middlewareAuth } = NextAuth(authConfig);

export default middlewareAuth((req) => {
  const isLoggedIn = !!req.auth;
  const nextUrl = req.nextUrl;
  const pathname = nextUrl.pathname;

  // SIMA FELHASZNÁLÓI OLDALAK VÉDELME
  if (
    !isLoggedIn &&
    (pathname.startsWith("/fiokom") ||
      pathname.startsWith("/admin/rendelesek") ||
      pathname.startsWith("/admin/feltoltes"))
  ) {
    const newUrl = new URL("/belepes", nextUrl.origin);
    return Response.redirect(newUrl);
  }

  //  ADMIN ALOLDALAK VÉDELME

  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const userRole = req.auth?.user?.role;

    // Ha nincs belépve, VAGY belépett, de nem admin a role
    if (!isLoggedIn || userRole !== "admin") {
      const newUrl = new URL("/belepes", nextUrl.origin);
      return Response.redirect(newUrl);
    }
  }
});

// A MATCHER LISTÁJA
export const config = {
  matcher: ["/fiokom/:path*", "/rendelesek/:path*", "/admin/:path*"],
};
