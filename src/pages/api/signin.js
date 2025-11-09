export async function GET({ cookies, url, redirect }) {
  const clientId = import.meta.env.CLIENT_ID;
  const redirectUri = `${import.meta.env.PUBLIC_URL}/api/callback`;
  const scope = encodeURIComponent('identify guilds');
  const state = crypto.randomUUID(); // Anti-CSRF

  cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 min
  });

  const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;

  return redirect(discordUrl);
}