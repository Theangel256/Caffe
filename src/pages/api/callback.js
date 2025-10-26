import fetch from 'node-fetch';
import { serialize, parse } from 'cookie';
import { sign } from 'cookie-signature';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-32-char-secret';

export async function GET(context) {
  const code = context.url.searchParams.get('code');
  if (!code) return new Response('No code provided', { status: 400 });

  const params = new URLSearchParams({
    client_id: import.meta.env.CLIENT_ID,
    client_secret: import.meta.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${import.meta.env.PUBLIC_URL}/api/callback`,
  });

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return context.redirect('/error');

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  const sessionData = {
    id: user.id,
    username: user.username,
    avatar: user.avatar || '',
    accessToken: tokenData.access_token,
  };
  const signedSession = sign(JSON.stringify(sessionData), SESSION_SECRET);
  const cookie = serialize('session_data', signedSession, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    ...(process.env.NODE_ENV === 'production' && { secure: true, domain: new URL(process.env.PUBLIC_URL).hostname }),
  });

  return new Response(null, {
    status: 302,
    headers: { Location: '/dashboard', 'Set-Cookie': cookie },
  });
}