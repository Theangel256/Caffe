export async function GET() {
  const clientId = import.meta.env.CLIENT_ID;
  const redirectUri = encodeURIComponent(`${import.meta.env.PUBLIC_URL}/api/callback`);
  const scope = encodeURIComponent("identify guilds");
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  return Response.redirect(discordAuthUrl, 302);
}
