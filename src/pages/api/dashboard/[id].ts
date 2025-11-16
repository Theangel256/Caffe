// src/pages/api/dashboard/[id].ts
import type { APIRoute } from 'astro';
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import client from '../../../shard.js';
import guildSystem from '../../../utils/models/guilds.js';
import { getOrCreateDB } from '../../../utils/functions.js';

export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  console.log('[API Dashboard] Usuario:', user?.username || 'NO AUTENTICADO');
  if (!user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  const idserver = params.id;
  if (!idserver) {
    return new Response('Bad Request: Missing guild ID', { status: 400 });
  }
  let guild = client.guilds.cache.get(idserver);
  if (!guild) {
    try {
      guild = await client.guilds.fetch(idserver);
    } catch (err) {
      console.warn(`[Dashboard] Guild no encontrado: ${idserver}`);
    }
  }
  if (!guild) {
    if (!client.user?.id) { return new Response('Bot not ready', { status: 500 }); }
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${idserver}`;
    return new Response(null, { status: 302, headers: { Location: invite } });
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return new Response(null, { status: 302, headers: { Location: '/error404' } });
  }
  const defaultDB = {
    guildID: idserver,
    prefix: '$',
  };
  let db;
  try {
    db = await getOrCreateDB(guildSystem, { guildID: idserver }, defaultDB);
  } catch (err) {
    console.error('[DB] Error al cargar guild:', err);
    return new Response('Database error', { status: 500 });
  }

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
    config: {
      guildID: idserver,
      prefix: db.prefix || '$',
      language: db.language || 'en',
      channelLogs: db.channelLogs || "",
      channelWelcome: db.channelWelcome || null,
      channelGoodbye: db.channelGoodbye || null,
      goodbyeBackground: db.goodbyeBackground || null,
      welcomeBackground: db.welcomeBackground || null,
      roleid: db.roleid || "",
      rolauto: db.rolauto || "",
      kick: db.kick || false,
      warningKickCounter: db.warningKickCounter || 0,
      ban: db.ban || false,
      warningBanCounter: db.warningBanCounter || 0,
      role: db.role || false,
      warningRoleCounter: db.warningRoleCounter || 0,
    },
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};