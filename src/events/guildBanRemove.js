const guildSystem = require("../models/guilds");
module.exports = async (client, guild, user) => {
  const msgDocument = await guildSystem
    .findOne({
      guildID: guild.id,
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
  const robot = { true: "Si", false: "No" };
  if (!guild.member(client.user).hasPermission("VIEW_AUDIT_LOG")) return;
  guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then((logs) => {
    const userID = logs.entries.first().executor.id;
    if (userID === client.user.id) return;
    const msgChannel = new client.Discord.MessageEmbed()
      .setTitle("**「:x:」 • Miembro Desbaneado**")
      .setColor("RED")
      .addField("**「:boy: 」• Nombre**", user.tag, true)
      .addField("**「:robot:」• Bot?**", robot[user.bot], true)
      .addField("Por", `<@${userID}>`, true)
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL({ dynamic: true }));
    if (canal) return canal.send(msgChannel);
  });
};
