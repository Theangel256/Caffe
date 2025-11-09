import { getMember } from "../utils/functions.js";
  
export async function run(client, message, args, lang) {
  const member = getMember(message, args, false);
  let reason = args.slice(1).join(" ");

  if (!args[0]) return message.reply(lang.commands.kick.no_args);

  if (!member) return message.reply(lang.commands.kick.no_user);

  if (!reason) reason = lang.no_reason;

  if (member.user.id === message.author.id)
    return message.reply(lang.commands.kick.yourself);

  if (!member.kickable)
    return message.channel.send(lang.commands.kick.kickable);

  member.kick(reason);

  message.channel.send(lang.commands.kick.sucess.replace(/{user.tag}/gi, member.user.tag).replace(/{reason}/gi, reason)
  );
};
export const help = {
  name: "kick",
  description: "Expulsa a alguien que odies con este comando!",
};
export const requirements = {
  userPerms: ["KICK_MEMBERS"],
  clientPerms: ["KICK_MEMBERS"],
  ownerOnly: false,
};
