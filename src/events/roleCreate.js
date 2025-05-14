const guildSystem = require("../utils/models/guilds");
const { getOrCreateDB } = require('../utils/functions.js');
module.exports = async (client, role) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: role.guild.id });
  const { channelLogs } = guildsDB;
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
      client.user.displayAvatarURL({ extension: "webp"}),
      true
    );
  logginChannel.send(rolembed);
};
