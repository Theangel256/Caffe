import economySystem from "../utils/models/users.js";
import { getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, lang) {
  const reward = 1200; // Daily reward amount
  const economy = await getOrCreateDB(economySystem, { userID: message.author.id });
  if(!economy) return message.channel.send(lang.dbError)
    lang = lang.commands.daily;
    if (economy.canClaimDaily) {
      economy.money += 100;
      economy.lastDaily = new Date();
      await economy.save();
      return message.channel.send(lang.sucess.replace(/{total}/gi, reward.toLocaleString()));
    } else {
      const hoursLeft = 24 - moment().diff(moment(economy.lastDaily), 'hours');
      return message.channel.send(lang.wait.replace(/{duration}/gi, hoursLeft));
  }
};
export const help = {
  name: "daily",
  description: "Cada 24h usa este comando para ganar una paga diaria!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
export const limits = {
  cooldown: 3000,
  rateLimit: 1,
};
