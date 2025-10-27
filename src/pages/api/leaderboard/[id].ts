import { APIContext } from 'astro';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { client } = require("../../../shard.js");
const levels = require("../../../utils/models/levels.js");

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  lvl: number;
  xp: number;
}

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  accessToken?: string;
}

export async function GET(context: APIContext) {
  const { params } = context;
  const id = params.id;
  const user = context.locals.user as DiscordUser | undefined;

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const guild = client.guilds.cache.get(id) || (await client.guilds.fetch(id).catch(() => null));
  if (!guild) {
    return new Response('Guild not found', { status: 404 });
  }

  const members = await guild.members.fetch();
  const member = members.get(user.id);
  if (!member || !member.permissions.has(8)) { // Admin permission check
    return new Response('Unauthorized', { status: 403 });
  }

  const users = await levels.find({ guildID: id });
  const sortedUsers = users
    .map((user) => [user.userID, user.lvl, user.xp])
    .sort((a, b) => b[1] - a[1] || b[2] - a[2]);

  const enrichedUsers = await Promise.all(
    sortedUsers.slice(0, 50).map(async ([userID, lvl, xp]) => {
      try {
        const user = await client.users.fetch(userID);
        return {
          id: userID,
          name: user.username,
          avatar: user.displayAvatarURL({ extension: 'png' }),
          lvl,
          xp,
        };
      } catch {
        return { id: userID, name: 'Unknown User', avatar: '', lvl, xp };
      }
    })
  );

  return new Response(
    JSON.stringify({ guild: { id: guild.id, name: guild.name }, users: enrichedUsers }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}