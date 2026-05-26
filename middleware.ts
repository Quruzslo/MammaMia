// middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/fiokom")) {
    const newUrl = new URL("/belepes", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

// Csak a /fiokom oldalon (és annak aloldalain) fusson le ez az ellenőrzés
export const config = {
  matcher: ["/fiokom/:path*", "/rendelesek"],
};
