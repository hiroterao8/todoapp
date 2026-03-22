import { auth } from "@/auth";

export default auth;

export const config = {
  matcher: ["/((?!api/auth|login|unauthorized|_next/static|_next/image|favicon\\.ico).*)"],
};
