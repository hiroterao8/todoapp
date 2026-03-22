import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie =
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("authjs.session-token");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|login|unauthorized|_next/static|_next/image|favicon\\.ico).*)"],
};
