const moment = require("moment");
require("moment-duration-format");
const economySystem = require("../models/users");
const { getOrCreateDB } = require("../functions");
module.exports.run = async (client, message) => {
  const lang = client.lang.commands.daily;
  const cooldown = 86400000; // 24 hours in milliseconds
  const reward = 1200; // Daily reward amount
    const economy = await getOrCreateDB(economySystem, { userID: message.author.id });
    if (!economy) return message.channel.send("I have an error while trying to access to the database, please try again later.");

    if (Date.now() < economy.daily) {
      const remaining = moment.duration(economy.daily - Date.now()).format("D [d], H [hrs], m [m], s [s]");
      return message.channel.send(lang.wait.replace(/{duration}/gi, remaining));
    }
    economy.money += reward;
    economy.daily = Date.now() + cooldown;
    await economy.save();
  
    return message.channel.send(lang.sucess.replace(/{total}/gi, reward.toLocaleString()));
};

module.exports.help = {
  name: "daily",
  description: "Cada 24h usa este comando para ganar una paga diaria!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
module.exports.limits = {
  cooldown: 3000,
  rateLimit: 1,
};
