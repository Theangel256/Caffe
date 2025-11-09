import guildSystem from "../utils/models/guilds.js";
import { getOrCreateDB } from "../utils/functions.js";
export default async function messageUpdate(client, oldMessage, newMessage) {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: oldMessage.guild.id });
  const { channelLogs } = guildsDB;
  if (oldMessage.content === newMessage.content) return;
  const logginChannel = client.channels.resolve(channelLogs);
  if (!logginChannel) return;
  const logEmbed = new EmbedBuilder()
    .setTitle(
      "**「:writing_hand:」** Mensaje Editado (Click para ir al mensaje)"
    )
    .setColor("BLUE")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setAuthor(
      oldMessage.author.tag,
      oldMessage.author.displayAvatarURL({ extension: "webp"})
    )
    .setURL(
      `http://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`
    );
  if (oldMessage.content) {
    logEmbed.addField("Antes", oldMessage.content, true);
  }
  logEmbed.addField("En:", oldMessage.channel, true);
  if (newMessage.content) {
    logEmbed.addField("Despues", newMessage.content, true);
  }
  logEmbed.setTimestamp().setFooter(`ID: ${oldMessage.author.id}`);
  logginChannel.send(logEmbed);
};
