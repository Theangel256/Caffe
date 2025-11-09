import fetch from 'node-fetch';
import { sign } from 'cookie-signature';

export async function GET({ url, cookies, redirect }) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('oauth_state')?.value;

  if (!code || !state || state !== storedState) {
    return new Response('Invalid state or code', { status: 400 });
  }

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
  if (!tokenData.access_token) return redirect('/error');

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const user = await userRes.json();

  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const guilds = await guildsRes.json();

  const sessionData = {
    id: user.id,
    username: user.username,
    avatar: user.avatar || '',
    accessToken: tokenData.access_token,
    guilds: guilds.map(g => ({
      id: g.id,
      name: g.name,
      permissions: Number(g.permissions)
    }))
  };

  const signedSession = sign(JSON.stringify(sessionData), process.env.SESSION_SECRET);
  cookies.set('session_data', signedSession, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 días
  });

  cookies.delete('oauth_state');

  return redirect('/dashboard');
}