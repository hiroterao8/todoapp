import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  const email = session?.user?.email ?? "";
  if (!email.endsWith("@suswork.jp")) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|login|unauthorized|_next/static|_next/image|favicon\\.ico).*)"],
};
