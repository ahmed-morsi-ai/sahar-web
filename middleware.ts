import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const isAdmin = req.nextauth.token?.role === "ADMIN";

    if (pathname === "/admin/login" && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname;
        if (pathname === "/admin/login") return true;
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
          return token?.role === "ADMIN";
        }
        return true;
      }
    },
    pages: {
      signIn: "/admin/login"
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
