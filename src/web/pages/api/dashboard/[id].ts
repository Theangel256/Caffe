import { getOrCreateDB } from "../../../../utils/functions.js";
// Update the import path to the correct relative location
import guildSystem from "../../../../utils/models/guilds.js";
import { ChannelType, PermissionFlagsBits } from "discord.js";
import { SESSION_STORE } from "../../../../middleware/session.js"; // tu Map() con sesiones activas
import client from "../../../../server.js"; // tu instancia del bot (Client)

export async function GET({ params, cookies }: { params: { id: string }, cookies: any }) {
  const sessionId = cookies.get("session_id")?.value;
  const user = SESSION_STORE.get(sessionId);

  if (!user) {
    return new Response(null, { status: 302, headers: { Location: "/signin" } });
  }

  const idserver = params.id;
  let guild = client.guilds.cache.get(idserver) || (await client.guilds.fetch(idserver).catch(() => null));

  // Si el bot no está en el servidor
  if (!guild) {
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8&guild_id=${idserver}`;
    return new Response(null, { status: 302, headers: { Location: invite } });
  }

  // Verificar si el usuario tiene permisos de admin
  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member || !member.permissions.has(PermissionFlagsBits.Administrator)) {
    return new Response(null, { status: 302, headers: { Location: "/error404" } });
  }

  // Obtener o crear datos del servidor
  const db = await getOrCreateDB(guildSystem, { guildID: idserver });
  if (!db) throw new Error("Database error");
  
  // Contar estados de conexión
  const fetchedMembers = await guild.members.fetch();
  const statusCounts = { online: 0, idle: 0, dnd: 0, offline: 0 };
  type StatusType = keyof typeof statusCounts;
  for (const m of fetchedMembers.values()) {
    const status = m.presence?.status as StatusType | undefined;
    if (status && statusCounts[status] !== undefined) {
      statusCounts[status]++;
    }
  }
  // Contar baneados (si el bot tiene permiso)
  let bans = false;
  if (guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
    const fetchedBans = await guild.bans.fetch();
    bans = fetchedBans.size;
  }

    return new Response(
    JSON.stringify({
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
        roles: guild.roles.cache.size - 1,
        channels: guild.channels.cache.filter((x: { type: string; }) => x.type !== "category").size,
        createdAt: guild.createdAt,
      },
      statusCounts,
      bans,
      db,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}