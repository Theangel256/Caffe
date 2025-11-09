import { PermissionsBitField } from "discord.js";

export async function run(client, message, args) {
  const user = args[0];

  if (!user) return message.reply(" Ingrese una ID del usuario baneado.");

  if (user === message.author.id)
    return message.reply(" Obviamente tu ID no está baneada.");

  if (message.guild.members.resolve(user))
    return message.channel.send("Esta ID no esta baneada aqui.");

  message.guild.members.cache.unban(user);
  message.channel.send(
    `Se ha removido la sanción al usuario: **${user.username}**`
  );
};
export const help = {
  name: "unban",
  description: "te arrepentiste de banear a alguien? usa este comando",
};
export const requirements = {
  userPerms: [PermissionsBitField.Flags.BanMembers],
  clientPerms: [],
  ownerOnly: false,
};
