const { getMember } = require("../utils/functions.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
module.exports.run = (client, message, args) => {
  const member = getMember(message, args, true),
    lang = client.lang.commands.avatar,
    embed = new EmbedBuilder()
      .setImage(member.user.displayAvatarURL({ extension: "png", size: 2048 }))
      .setColor(member.displayHexColor)
      .setFooter({
        text: message.author.id === member.user.id
          ? lang.no_user.replace(/{user.username}/gi, member.user.username)
          : lang.user.replace(/{user.username}/gi, member.user.username)
      });
  message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "avatar",
  description: "Muestra el avatar que tienes actualmente",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.EmbedLinks
  ],
  ownerOnly: false,
};
module.exports.limits = {
  rateLimit: 3,
  cooldown: 20000,
};
