import { PermissionsBitField } from "discord.js";
import { getOrCreateDB } from "../utils/functions.js";
import users from "../utils/models/users.js";
export async function run(client, message) {
  const economy = getOrCreateDB(users, "economy", { userID: message.author.id });

  let elements = ['100','75', '50'];
  let cacthElements = elements[Math.floor(elements.length * Math.random())];
  let jobs = ['Trabajas en una cafeteria y ganaste $', 'Trabajaste de repartidor de pizas y recibiste $', "Editaste un video de un YouTuber y te pago $"]
  let cacthJobs = jobs[Math.floor(elements.length * Math.random())];
  economy.money += parseInt(cacthElements);
  await economy.save();
  return message.channel.send(`> ${cacthJobs}${cacthElements}`)
};
export const help = {
  name: "work",
  aliases: ["w"],
  description: "trabaja duro para conseguir dinero!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.EmbedLinks],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 1,
  cooldown: 300000,
};
