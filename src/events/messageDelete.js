const { PermissionFlagsBits, EmbedBuilder, Colors } = require("discord.js");
const guildSystem = require("../utils/models/guilds");
const { getOrCreateDB } = require('../utils/functions.js');
export default async (client, message) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: message.guild.id });
  const { channelLogs } = guildsDB;
  const logginChannel = client.channels.resolve(channelLogs);
  if (!logginChannel) return console.log(logginChannel);
  if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return console.log("No permissions to view audit logs");
  try {
    const audit = await message.guild.fetchAuditLogs({ type: 72 }); // 72 = Message Delete
    const entry = audit.entries.first();
  let user = "";
  if (entry && entry.extra && entry.extra.channel && entry.target) {
    if (entry.extra.channel.id === message.channel.id) {
      if (entry.target.id === message.author.id &&
          entry.createdTimestamp > Date.now() - 5000 &&
          entry.extra.count >= 1) {
        user = entry.executor;  
      } else if (entry.target.id === client.user.id) {
        user = entry.executor; 
      } else {
        user = message.author;
      }
    } else {
      user = message.author;
    }
  } else {
    console.log("Audit entry does not have the expected properties:", entry);
    user = message.author;
  }
  const embed = new EmbedBuilder()
    .setTitle("**「:wastebasket:」** Mensaje Borrado")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setAuthor({ name: message.author.username + "#" + message.author.discriminator, iconURL: message.author.displayAvatarURL({ extension: "webp"}) })
    embed.setFooter({text: `ID: ${message.author.id}`, iconURL: message.author.displayAvatarURL({ extension: "webp"}) })
    .setTimestamp()
    .setColor(Colors.Red)
    .addFields({ name: "En", value: message.channel.toString(), inline: true });
  if (!user.bot) {
    embed.addFields({ name: "Por", value: `<@${user.id}>`, inline: true });
  }
  if (message.content) {
    embed.addFields({ name: "Mensaje", value: message.content, inline: true });
  }
  if (message.attachments.size > 0) {
    const Attachs = message.attachments.array();
    Attachs.forEach((m) => {
      embed
        .setTitle("**「:wastebasket:」** Imagen Borrada")
        .setImage(m.proxyURL);
      logginChannel.send({ embeds: [embed] });
    });
  }
} catch (e) {
  console.log("Error fetching audit logs:", e);
}
};
