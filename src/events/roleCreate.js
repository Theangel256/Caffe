import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async function roleCreate(client, role) {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: role.guild.id });
  const { channelLogs } = guildsDB;
  const logginChannel = client.channels.resolve(channelLogs);
  if (!logginChannel) return;
  const rolembed = new EmbedBuilder()
    .setTitle("**「:white_check_mark: 」Rol Creado**")
    .setColor("GREEN")
    .addField("Nombre:", role.name, true)
    .addField("ID:", role.id, true)
    .setTimestamp()
    .setFooter(
      `•${role.guild.name}•`,
      client.user.displayAvatarURL({ extension: "webp"}),
      true
    );
  logginChannel.send(rolembed);
};
