import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const email = auth?.user?.email ?? "";

      if (!isLoggedIn) return false;

      if (!email.endsWith("@suswork.jp")) {
        return Response.redirect(new URL("/unauthorized", request.url));
      }

      return true;
    },
    async signIn({ user }) {
      return user.email?.endsWith("@suswork.jp") ?? false;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
