import { APIContext } from 'astro';
import { PermissionFlagsBits } from 'discord.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getOrCreateDB } = require("../../../utils/functions.js");
const guildSystem = require("../../../utils/models/guilds");
const { client } = require("../../../shard.js");

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  accessToken?: string;
}

interface GuildData {
  guild: {
    id: string;
    name: string;
    memberCount: number;
    roles: number;
    channels: number;
    createdAt: Date;
  };
  statuses: { online: number; idle: number; dnd: number; offline: number };
  bans: number | false;
  db: any; // Adjust based on your DB structure
}

export async function GET(context: APIContext) {
  const { params } = context;
  const idserver = params.id;
  const user = context.locals.user as DiscordUser | undefined;

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const guild = client.guilds.cache.get(idserver) || (await client.guilds.fetch(idserver).catch(() => null));

  if (!guild) {
    if (!client.user) return new Response("Bot user not initialized", { status: 500 });
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${idserver}`;
    return new Response(null, { status: 302, headers: { Location: invite } });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return new Response(null, { status: 302, headers: { Location: "/error404" } });
  }

  const db = await getOrCreateDB(guildSystem, { guildID: idserver });
  if (!db) throw new Error("Database error");

  const fetchedMembers = await guild.members.fetch();
  const statuses = { online: 0, idle: 0, dnd: 0, offline: 0 };

  fetchedMembers.forEach((m: { presence: { status: string | undefined } }) => {
    const status = m.presence?.status as keyof typeof statuses | undefined;
    if (status && statuses[status] !== undefined) statuses[status]++;
  });

  const bans = guild.members.me && guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)
    ? (await guild.bans.fetch()).size
    : false;

  return new Response(
    JSON.stringify({
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        roles: guild.roles.cache.size - 1,
        channels: guild.channels.cache.filter((x: { type: ChannelType }) => x.type !== ChannelType.GuildCategory).size,
        createdAt: guild.createdAt,
      },
      statuses,
      bans,
      db,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}