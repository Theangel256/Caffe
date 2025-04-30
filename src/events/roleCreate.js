const guildSystem = require("../models/guilds");
module.exports = async (client, role) => {
  const msgDocument = await guildSystem
    .findOne({
      guildID: role.guild.id,
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
      client.user.displayAvatarURL({ dynamic: true }),
      true
    );
  logginChannel.send(rolembed);
};
