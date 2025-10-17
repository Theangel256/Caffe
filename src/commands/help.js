const { PermissionsBitField } = require("discord.js");

module.exports.run = (client, message, args) => {
  let embed = {
    color: 0x00ffff,
    author: {
      icon_url: client.user.displayAvatarURL({ extension: "webp"})
    },
    description: ""
  };

  if (args[0] && client.commands.get(args[0])) {
    const cmd = client.commands.get(args[0]);

    embed.author.name = `${cmd.help.name} | Help`;
    embed.description = `**Name:** ${cmd.help.name}\n**Description:** ${cmd.help.description}`;
  } else {
    embed.author.name = `Help | ${client.user.username}`;
    embed.footer = {
      text: `${process.env.PUBLIC_URL} V${require("../../package.json").version}`,
      icon_url: client.user.displayAvatarURL({ extension: "webp"})
    };
    embed.description = client.commands.map((cmd) => cmd.help.name).join(", ");
  }

  return message.channel.send({ embeds: [embed] });
};

module.exports.help = {
  name: "help",
  aliases: ["cmds", "commands"],
  description: "obten ayuda de cuantos y cuales son los comandos de Caffe!",
};

module.exports.requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.EmbedLinks,
  ],
  ownerOnly: false,
};
