import { PermissionsBitField } from "discord.js";
import { getMember } from "../utils/functions.js";
export async function run(client, message, args) {
  const cooldown = new client.database("cooldownmute"),
    tomute = getMember(message, args, false);

  if (!tomute) return message.channel.send("Menciona a alguien.");
  const muted = tomute.roles.cache.find((r) => r.name === "Muted");
  if (!muted) return message.channel.send("Este usuario no esta muteado");
  const muterole = message.guild.roles.cache.find((r) => r.name === "Muted");

  cooldown.delete(`${message.guild.id}.${tomute.user.id}`);
  tomute.roles.remove(muterole.id);
  message.channel.send(`${tomute.user.tag} Ha sido desmuteado!`);
};
export const help = {
  name: "unmute",
  description: "te excediste de tiempo? desilencia a un usuario",
};
export const requirements = {
  userPerms: [PermissionsBitField.Flags.ManageMessages],
  clientPerms: [],
  ownerOnly: false,
};
