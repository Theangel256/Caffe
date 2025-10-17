import { getOrCreateDB } from "../../../utils/functions";
import guildSystem from "../../../utils/models/guilds";
import { ChannelType, PermissionFlagsBits } from "discord.js";

// Simple in-memory session check (replace with your DB/session)
export async function GET({ params, locals }) {
  const guildId = params.id;
  const user = locals.user;
  const bot = locals.bot;

  if (!user) return new Response("Unauthorized", { status: 401 });

  const guild =
    bot.guilds.cache.get(guildId) ||
    await bot.guilds.fetch(guildId).catch(() => null);

  if (!guild) {
    const DsInv = `oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8&response_type=code&guild_id=${guildId}`;
    return Response.redirect("https://discord.com/" + DsInv);
  }

  const member = await guild.members.fetch(user.id).catch(() => null);
  if (!member?.permissions.has(PermissionFlagsBits.Administrator)) {
    return Response.redirect("/error404");
  }

  const db = await getOrCreateDB(guildSystem, { guildID: guildId });
  if (!db) throw new Error("Database error");

  // Count member statuses
  const fetchedMembers = await guild.members.fetch();
  const statuses = { online: 0, idle: 0, dnd: 0, offline: 0 };
  fetchedMembers.forEach((m) => {
    const status = m.presence?.status;
    if (status && statuses[status] !== undefined) statuses[status]++;
  });

  // Return JSON for Astro page to consume
  return new Response(JSON.stringify({
    guild,
    db,
    statuses,
    bans: guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)
      ? (await guild.bans.fetch()).size
      : false,
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
