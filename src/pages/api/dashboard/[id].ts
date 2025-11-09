// src/pages/api/dashboard/[id].ts
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { getOrCreateDB } from '../../../utils/functions.js';
import guildSystem from '../../../utils/models/guilds.js';
import client from '../../../shard.js';

export const GET = async ({ params, locals }) => {
  const user = locals.user;
  console.log('[API Dashboard] Usuario:', user?.username || 'NO AUTENTICADO');

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const idserver = params.id;
  let guild = client.guilds.cache.get(idserver);
  if (!guild) {
    guild = await client.guilds.fetch(idserver).catch(() => null);
  }

  if (!guild) {
    if (!client.user) return new Response("Bot not ready", { status: 500 });
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${idserver}`;
    return new Response(null, { status: 302, headers: { Location: invite } });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return new Response(null, { status: 302, headers: { Location: '/error404' } });
  }

  const db = await getOrCreateDB(guildSystem, { guildID: idserver });
  if (!db) throw new Error("DB error");

  const members = await guild.members.fetch();
  const statuses = { online: 0, idle: 0, dnd: 0, offline: 0 };
  members.forEach(m => {
    const s = m.presence?.status;
    if (s && s in statuses) statuses[s]++;
  });

  let bans: number | false = false;
  if (guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
    try {
      bans = (await guild.bans.fetch()).size;
    } catch {}
  }

  return new Response(JSON.stringify({
    guild: {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      roles: guild.roles.cache.size - 1,
      channels: guild.channels.cache.filter(c => c.type !== ChannelType.GuildCategory).size,
      createdAt: guild.createdAt.toISOString(),
    },
    statuses,
    bans,
    db,
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};