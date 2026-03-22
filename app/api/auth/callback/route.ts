import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = (process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "https://todoapp-neon-iota.vercel.app").replace(/\/$/, "");
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.cookies.get("auth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/login?error=state`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${baseUrl}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokens.access_token) {
    return NextResponse.redirect(`${baseUrl}/login?error=token`);
  }

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = await userRes.json();

  if (!user.email?.endsWith("@suswork.jp")) {
    return NextResponse.redirect(`${baseUrl}/unauthorized`);
  }

  // Set session cookie
  const sessionData = Buffer.from(JSON.stringify({ email: user.email, name: user.name })).toString("base64");
  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set("session", sessionData, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.delete("auth_state");

  return response;
}
