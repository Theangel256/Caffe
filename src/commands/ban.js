import { PermissionsBitField } from "discord.js";
import { getMember } from "../utils/functions.js";
export function run(client, message, args, lang) {
  const member = getMember(message, args, false)
  langBan = lang.commands.ban;
  let reason = args.slice(1).join(" ");

  if (!args[0]) return message.channel.send(langBan.no_args);

  if (!member) return message.channel.send(langBan.no_user);

  if (!reason) reason = lang.no_reason;

  if (member.user.id === message.author.id)
    return message.channel.send(langBan.yourself);

  if (!member.bannable) return message.channel.send(langBan.bannable);

  member.ban({ reason: reason });

  message.channel.send({
    content: langBan.sucess
      .replace(/{user.tag}/gi, member.user.tag)
      .replace(/{reason}/gi, reason),
  });
};
export const help = {
  name: "ban",
  description: "Banea a una persona con este comando",
};
export const requirements = {
  userPerms: [ 
    PermissionsBitField.Flags.BanMembers
    ],
  clientPerms: [
    PermissionsBitField.Flags.BanMembers
    ],
  ownerOnly: false,
};
