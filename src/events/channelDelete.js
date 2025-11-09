import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async (client, channel) => {
  if (channel.type === "dm") return;
    const guildsDB = await getOrCreateDB(guildSystem, { guildID: channel.guild.id });
  const { channelLogs } = guildsDB;
  const canal = client.channels.resolve(channelLogs);
  const logEmbed = new EmbedBuilder()
    .setTitle("**「:x:」• Canal Removido**")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setColor("RED")
    .addField("Tipo", "`" + channel.type + "`", true)
    .addField("Nombre", "`" + channel.name + "`", true)
    .addField("Creado", "`" + channel.createdAt.toDateString() + "`", true)
    .addField("ID", "`" + channel.id + "`", true)
    .setTimestamp()
    .setFooter(
      `•${channel.guild.name}•`,
      client.user.displayAvatarURL({ extension: "webp"}),
      true
    );
  if (canal) return canal.send(logEmbed);
};
