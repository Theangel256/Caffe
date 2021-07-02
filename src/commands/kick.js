const { getMember } = require("../structures/functions");
module.exports.run = (client, message, args) => {
  const member = getMember(message, args, false);
  let reason = args.slice(1).join(" ");

  if (!args[0]) return message.reply(client.lang.commands.kick.no_args);

  if (!member) return message.reply(client.lang.commands.kick.no_user);

  if (!reason) reason = client.lang.no_reason;

  if (member.user.id === message.author.id)
    return message.reply(client.lang.commands.kick.yourself);

  if (!member.kickable)
    return message.channel.send(client.lang.commands.kick.kickable);

  member.kick(reason);

  message.channel.send(
    client.lang.commands.kick.sucess
      .replace(/{user.tag}/gi, member.user.tag)
      .replace(/{reason}/gi, reason)
  );
};
module.exports.help = {
  name: "kick",
  description: "Expulsa a alguien que odies con este comando!",
};
module.exports.requirements = {
  userPerms: ["KICK_MEMBERS"],
  clientPerms: ["KICK_MEMBERS"],
  ownerOnly: false,
};
