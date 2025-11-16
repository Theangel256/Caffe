import { APIRoute } from 'astro';
import client from "../../../shard.js";
import levels from '../../../utils/models/levels.js';
import { getOrCreateDB } from "../../../utils/functions.js"

export const GET: APIRoute = async ({ params, request }) => {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = auth.split(' ')[1];

  // Validar token con Discord
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!userRes.ok) return new Response('Invalid token', { status: 401 });
  const user = await userRes.json();

  const { id } = params;
  if (!id) return new Response('Bad Request', { status: 400 });

  let guild = client.guilds.cache.get(id);
  if (!guild) {
    guild = await client.guilds.fetch(id).catch(() => null);
  }

  const db = await getOrCreateDB(levels, { guildID: id });
  if (!db) throw new Error("DB error");
  const sortedUsers = db
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
    JSON.stringify({ guild, users: enrichedUsers }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};