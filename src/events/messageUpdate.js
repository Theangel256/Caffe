const guildSystem = require("../models/guilds");
module.exports = async (client, oldMessage, newMessage) => {
  const msgDocument = await guildSystem
    .findOne({
      guildID: newMessage.guild.id,
    })
    .catch((err) => console.log(err));
  if (!msgDocument) {
    try {
      const dbMsg = await new guildSystem({
        guildID: message.guild.id,
        prefix: process.env.prefix,
        language: "en",
        role: false,
        kick: false,
        ban: false,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const { channelLogs } = dbMsgModel;
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
      oldMessage.author.displayAvatarURL({ dynamic: true })
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
