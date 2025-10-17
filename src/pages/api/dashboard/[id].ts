import { getOrCreateDB } from "../../../utils/functions.js";
// Update the import path to the correct relative location
import guildSystem from "../../../utils/models/guilds.js";
import { ChannelType, PermissionFlagsBits } from "discord.js";
import { SESSION_STORE } from "../callback.ts"; // tu Map() con sesiones activas
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { client } = require("../../../shard.js");
import { parse } from "cookie";

export async function GET({ params, request }: { params: { id: string }, request: Request }) {
  const idserver = params.id;
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader) as Record<string, string>;
  const sessionId = cookies.session_id;
  const user = SESSION_STORE.get(sessionId);

  if (!user) return new Response(null, { status: 302, headers: { Location: "/api/signin" } });

  const guild = client.guilds.cache.get(idserver) || (await client.guilds.fetch(idserver).catch(() => null));

  if (!guild) {
    if (!client.user) {
      return new Response("Bot user not initialized", { status: 500 });
    }
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

  fetchedMembers.forEach((m: { presence: { status: string | undefined; }; }) => {
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
        channels: guild.channels.cache.filter((x: { type: ChannelType; }) => x.type !== ChannelType.GuildCategory).size,
        createdAt: guild.createdAt,
      },
      statuses,
      bans,
      db,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
