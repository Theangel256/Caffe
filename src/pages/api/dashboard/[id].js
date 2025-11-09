// src/pages/api/dashboard/[id].js
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { getOrCreateDB } = require('../../../utils/functions.js');
const guildSystem = require('../../../utils/models/guilds.js');
const { client } = require('../../../shard.js');

/**
 * GET /api/dashboard/:id
 */
async function GET({ params, locals, url }) {
  const idserver = params.id;
  const user = locals?.user;

  // Verificar autenticación
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Obtener el servidor
  let guild = client.guilds.cache.get(idserver);
  if (!guild) {
    try {
      guild = await client.guilds.fetch(idserver);
    } catch (err) {
      guild = null;
    }
  }

  // Si no está en el servidor, redirigir a invitación
  if (!guild) {
    if (!client.user) {
      return new Response("Bot user not initialized", { status: 500 });
    }
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${idserver}`;
    return new Response(null, {
      status: 302,
      headers: { Location: invite }
    });
  }

  // Verificar que el usuario es administrador
  let member;
  try {
    member = await guild.members.fetch(user.id);
  } catch (err) {
    member = null;
  }

  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/error404" }
    });
  }

  // Base de datos
  const db = await getOrCreateDB(guildSystem, { guildID: idserver });
  if (!db) {
    throw new Error("Database error");
  }

  // Contar estados de presencia
  const fetchedMembers = await guild.members.fetch();
  const statuses = { online: 0, idle: 0, dnd: 0, offline: 0 };

  fetchedMembers.forEach(m => {
    const status = m.presence?.status;
    if (status && statuses.hasOwnProperty(status)) {
      statuses[status]++;
    }
  });

  // Contar bans (solo si el bot tiene permiso)
  let bans = false;
  if (
    guild.members.me &&
    guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)
  ) {
    try {
      const banList = await guild.bans.fetch();
      bans = banList.size;
    } catch (err) {
      bans = false;
    }
  }

  // Respuesta final
  return new Response(
    JSON.stringify({
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        roles: guild.roles.cache.size - 1, // Excluye @everyone
        channels: guild.channels.cache.filter(
          ch => ch.type !== ChannelType.GuildCategory
        ).size,
        createdAt: guild.createdAt,
      },
      statuses,
      bans,
      db,
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
// Exportar la función GET
export { GET };