const guildSystem = require("../utils/models/guilds");
const { getOrCreateDB } = require('../utils/functions.js');
module.exports = async (client, oldMember, newMember) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: oldMember.guild.id });
  const { channelLogs } = guildsDB;
  if (!oldMember.guild.member(client.user).permissions.has("VIEW_AUDIT_LOG"))
    return;
  const entry = await oldMember.guild
    .fetchAuditLogs({ type: "MEMBER_UPDATE" })
    .then((audit) => audit.entries.first());
  const channel = client.channels.resolve(channelLogs);
  if (oldMember.nickname !== newMember.nickname) {
    const user = entry.executor;
    const msgChannel = new EmbedBuilder()
      .setTitle("**「:writing_hand:」 • Nickname Actualizado**")
      .setColor("BLUE")
      .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
      .setFooter(
        `ID: ${oldMember.user.id}`,
        oldMember.user.displayAvatarURL({ extension: "webp"})
      )
      .setAuthor(user.tag, user.displayAvatarURL({ extension: "webp"}));
    if (oldMember.nickname !== null) {
      msgChannel.addField("Nickname anterior", oldMember.nickname, true);
    }
    msgChannel
      .addField(
        "Nickname Actual",
        newMember.nickname === null
          ? newMember.user.username
          : newMember.nickname,
        true
      )
      .addField("Por", `<@${user.id}>`, true)
      .setTimestamp();
    if (channel) return channel.send(msgChannel);
  }
};
