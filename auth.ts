import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      return user.email?.endsWith("@suswork.jp") ?? false;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
