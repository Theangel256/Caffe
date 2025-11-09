import moment from "moment";
import "moment-duration-format";
import { getMember } from "../utils/functions.js";
import users from "../utils/models/users.js";
import { getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, args, lang) {
  const economy = await getOrCreateDB(users, { userID: message.author.id });
  if (economy.repCooldown && Date.now() < economy.repCooldown) {
	const duracion = moment.duration(economy.repCooldown - Date.now()).format(" D [d], H [hrs], m [m], s [s]");
	return message.channel.send(lang.wait.replace(/{duration}/gi, duracion));
  }
  const member = getMember(message, args, false);
  if (!member) return message.channel.send(lang.no_user);
  if (member.user.id === message.author.id) return message.channel.send("No puedes darte reputacion ati mismo");
  if (member.user.bot) return message.channel.send("No puedes darle reputacion a un bot");
  const memberEconomy = await getOrCreateDB(users, { userID: member.user.id });
  memberEconomy.reputation = (memberEconomy.reputation || 0) + 1;
  await memberEconomy.save();
  message.channel.send(`<:rep:741355268625006694>Punto de reputacion agregado a: **${member.user.username}**`);
  economy.repCooldown = Date.now() + 86400000;
  await economy.save();
};
export const help = {
  name: "reputation",
  aliases: ["rep"],
  description: "Agregale reputacion a tu amigo!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
