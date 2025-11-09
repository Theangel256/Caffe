import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async (client, role) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: role.guild.id });
  const { channelLogs } = guildsDB;
  const traduccion = { false: "No", true: "Si" };
  const logginChannel = client.channels.resolve(channelLogs);
  const rolembed = new EmbedBuilder()
    .setTitle("**「:x: 」Rol Borrado**")
    .setColor("RED")
    .addField("Nombre:", role.name, true)
    .addField("ID:", role.id, true)
    .addField("Color:", role.hexColor, true)
    .addField("Mencionable:", traduccion[role.mentionable], true)
    .addField("Permisos:", role.permissions.bitfield, true)
    .addField("Creado:", role.createdAt.toDateString(), true)
    .setTimestamp()
    .setFooter(
      `•${role.guild.name}•`,
      client.user.displayAvatarURL({ extension: "webp"}),
      true
    );
  if (logginChannel) return logginChannel.send(rolembed);
};
