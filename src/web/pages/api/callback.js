import fetch from "node-fetch"; // or global fetch if supported
import { serialize } from "cookie";

// You need a database or session storage
const SESSION_STORE = new Map(); // Simple in-memory session store for example

export async function GET({ url }) {
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  // Exchange code for access token
  const params = new URLSearchParams();
  params.append("client_id", import.meta.env.CLIENT_ID);
  params.append("client_secret", import.meta.env.CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `${import.meta.env.PUBLIC_URL}/api/callback`);
  params.append("scope", "identify guilds");

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return Response.redirect("/error", 302);
  }

  // Fetch user info
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  // Create a session ID and store user in session store
  const sessionId = crypto.randomUUID();
  SESSION_STORE.set(sessionId, user);

  // Set session cookie
  const cookie = serialize("session_id", sessionId, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
      "Set-Cookie": cookie,
    },
  });
}
