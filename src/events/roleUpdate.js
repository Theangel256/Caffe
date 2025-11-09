import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async (client, oldRole, newRole) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: oldRole.guild.id });
  const { channelLogs } = guildsDB;
  const logginChannel = client.channels.resolve(channelLogs);
  const p1 = oldRole.permissions;
  const p2 = newRole.permissions;
  if (p1.equals(p2)) return;
  const r1 = p1.missing(p2);
  const r2 = p2.missing(p1);
  const embed = new EmbedBuilder()
    .setTitle("Permisos del rol cambiados")
    .addField("Rol", newRole.toString())
    .setColor("RANDOM");
  if (r1.length) {
    embed.addField("Permisos agregados", r1.join(", "));
  }
  if (r2.length) {
    embed.addField("Permisos removidos", r2.join(", "));
  }
  if (logginChannel) return logginChannel.send({ embeds: [embed] });
};
