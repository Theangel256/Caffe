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
  if (!guild.member(client.user).permissions.has("VIEW_AUDIT_LOG")) return;
  guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" }).then((logs) => {
    const userID = logs.entries.first().executor.id;
    const msgChannel = new EmbedBuilder()
      .setTitle("**「:x:」 • Miembro Baneado**")
      .setColor("RED")
      .addField("**「:boy: 」• Nombre**", user.tag, true)
      .addField("**「:robot:」• Bot?**", robot[user.bot], true)
      .addField("Por", `<@${userID}>`, true)
      .setTimestamp()
      .setFooter(guild.name, guild.iconURL({ dynamic: true }));
    if (canal) return canal.send(msgChannel);
  });
};
