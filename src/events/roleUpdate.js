const guildSystem = require("../models/guilds");
module.exports = async (client, oldRole, newRole) => {
  const msgDocument = await guildSystem
    .findOne({
      guildID: oldRole.guild.id,
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
  const p1 = oldRole.permissions;
  const p2 = newRole.permissions;
  if (p1.equals(p2)) return;
  const r1 = p1.missing(p2);
  const r2 = p2.missing(p1);
  const embed = new client.Discord.MessageEmbed()
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
