import { getMember } from "../utils/functions.js";
import { EmbedBuilder, PermissionsBitField } from "discord.js";
export function run(client, message, args, lang) {
  lang = lang.commands.avatar
  const member = getMember(message, args, true),
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
export const help = {
  name: "avatar",
  description: "Muestra el avatar que tienes actualmente",
};
export const requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.EmbedLinks
  ],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 3,
  cooldown: 20000,
};
