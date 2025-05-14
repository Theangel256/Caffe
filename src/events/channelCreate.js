const guildSystem = require("../models/guilds");
module.exports = async (client, channel) => {
  if (channel.type === "dm") return;
  const msgDocument = await guildSystem
    .findOne({
      guildID: channel.guild.id,
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
