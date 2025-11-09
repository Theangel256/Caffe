import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async (client, channel) => {
  if (channel.type === "dm") return;
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: channel.guild.id });
  const { channelLogs } = guildsDB;
  const canal = client.channels.resolve(channelLogs);
  const logEmbed = {
    color: "GREEN",
    title: "**「:white_check_mark: 」• Canal Creado**",
    description: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
    fields: [
      { name: "Tipo", value: "`" + channel.type + "`", inline: true, },
      { name: "Nombre", value: "`" + channel.name + "`", inline: true, },
      { name: "Creado", value: "`" + channel.createdAt.toDateString() + "`", inline: true, },
      { name: "ID", value: "`" + channel.id + "`", inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: `•${channel.guild.name}•`,
      icon_url: client.user.displayAvatarURL({ extension: "webp"}),
    },
  };
  
  canal.send({ embeds: [logEmbed] });

};
