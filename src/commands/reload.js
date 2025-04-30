const { EmbedBuilder } = require("discord.js");
module.exports.run = async (client, message) => {
  const reload = new EmbedBuilder()
    .setTitle(":arrows_counterclockwise: | **Recargando el sistema**")
    .setDescription("`Espera 5 Segundos`")
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/571049817921290250/572433829801754655/a8keeuutawx01.gif"
    )
    .setColor(0x00ffff)
    .setFooter("Requerido por " + message.author.username + "");
  message.channel.send(reload).then(() => {
    const vc = client.guilds.cache.get(message.guild.id).me.voiceChannel;
    if (vc) vc.leave();
    client.destroy();
    process.exit();
  });
};
module.exports.help = {
  name: "reload",
  aliases: ["rl"],
  description: "Solo Desarrolladores!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
