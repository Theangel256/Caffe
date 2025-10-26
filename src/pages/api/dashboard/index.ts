import { APIContext } from 'astro';
import { PermissionFlagsBits } from 'discord.js';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  guilds?: Array<{
    id: string;
    name: string;
    permissions: number;
  }>;
  accessToken?: string;
}

export async function GET(context: APIContext) {
  const user = context.locals.user as DiscordUser | undefined;

  if (!user || !user.accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  let guilds = user.guilds || [];
  if (!guilds.length) {
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    if (guildsRes.ok) {
      guilds = await guildsRes.json() as Array<{
        id: string;
        name: string;
        permissions: number;
      }>;
    }
  }

  const adminGuilds = guilds.filter((g) => (g.permissions & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator);

  return new Response(JSON.stringify({ guilds: adminGuilds, user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}