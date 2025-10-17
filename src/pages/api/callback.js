import fetch from "node-fetch"; // or global fetch if supported
import { serialize } from "cookie";

export const SESSION_STORE = new Map();

export async function GET({ url }) {
  const code = url.searchParams.get("code");
  if (!code) return new Response("No code provided", { status: 400 });

  const params = new URLSearchParams({
    client_id: import.meta.env.CLIENT_ID,
    client_secret: import.meta.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: `${import.meta.env.PUBLIC_URL}/api/callback`,
  });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return Response.redirect("/error", 302);

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  const sessionId = crypto.randomUUID();
  SESSION_STORE.set(sessionId, user);

  const cookie = serialize("session_id", sessionId, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días en ms
    sameSite: 'lax',
    domain: new URL(process.env.PUBLIC_URL).hostname, 
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
      "Set-Cookie": cookie,
    },
  });
}
