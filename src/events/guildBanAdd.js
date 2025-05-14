const guildSystem = require("../utils/models/guilds");
module.exports = async (client, guild, user) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: guild.id });
  const { channelLogs } = guildsDB;
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
