import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const email = req.nextauth.token?.email ?? "";
    if (!email.endsWith("@suswork.jp")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|login|unauthorized|_next/static|_next/image|favicon\\.ico).*)"],
};
