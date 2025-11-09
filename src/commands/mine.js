import econonomySystem from "../utils/models/users.js";
import { getOrCreateDB } from "../utils/functions.js";
import { EmbedBuilder } from "discord.js";
export async function run(client, message) {
  const reward = 150;
    const economy = await getOrCreateDB(economySystem, { userID: message.author.id });
    if (!economy) return message.channel.send(client.lang.dbError);
    economy.money += reward;
    await economy.save();
    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Mina Rueca', iconURL: message.author.displayAvatarURL({ extension: 'png' }) })
    .setDescription(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50`)
    .setColor(message.guild.members.me.displayHexColor);
    return message.channel.send({ embeds: [embed] });
};
export const help = {
  name: "mine",
  description: "trabaja duro para conseguir dinero!",
};
export const requirements = {
  userPerms: [],
  clientPerms: ["EMBED_LINKS"],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 1,
  cooldown: 300000,
};
