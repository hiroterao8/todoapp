import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://todoapp-neon-iota.vercel.app";
  const response = NextResponse.redirect(`${baseUrl}/login`);
  response.cookies.delete("session");
  return response;
}
