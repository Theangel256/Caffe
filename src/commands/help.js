const { EmbedBuilder } = require("discord.js");
module.exports.run = (client, message, args) => {
  const embed = new EmbedBuilder();
  if (args[0] && client.commands.get(args[0])) {
    const cmd = client.commands.get(args[0]);
    embed
      .setAuthor({
        name: `${cmd.help.name} | Help`, value: client.user. displayAvatarURL({ extension: "png"})
        })
      .setColor(0x00ffff)
      .setDescription(
        `**Name:** ${cmd.help.name}\n**Description:** ${cmd.help.description}`
      );
    return message.channel.send({ embeds: [embed] });
  }
  embed
    .setAuthor({
      name: `Help | ${client.user.username} `, value: client.user.displayAvatarURL({ extension: "png" })
})
    .setFooter({
      text: `${process.env.URL} V${require("../../package.json").version}`,
      iconURL: client.user.displayAvatarURL({ extension: "png" })
})
    .setDescription(client.commands.map((cmd) => cmd.help.name).join(", "));
  return message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "help",
  aliases: ["cmds", "commands"],
  description: "obten ayuda de cuantos y cuales son los comandos de Caffe!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [0x0000004000],
  // EMBED_LINKS
  ownerOnly: false,
};
