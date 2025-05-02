const moment = require("moment");
require("moment-duration-format");
const economySystem = require("../models/users");
module.exports.run = async (client, message) => {
  const lang = client.lang.commands.daily;
  const msgDocument = await economySystem.findOne({ userID: message.author.id }).catch(console.error);
  const cooldown = 86400000; // 24 hours in milliseconds
  const reward = 1200; // Daily reward amount
    if (!msgDocument) { 
      msgDocument = new economySystem({
        userID: message.author.id,
        money: reward,
        daily: Date.now() + cooldown
      });
      await msgDocument.save();
      return message.channel.send(lang.sucess.replace(/{total}/gi, reward.toLocaleString()));
    }
    if (Date.now() < msgDocument.daily) {
      const remaining = moment.duration(msgDocument.daily - Date.now()).format("D [d], H [hrs], m [m], s [s]");
      return message.channel.send(lang.wait.replace(/{duration}/gi, remaining));
    }
    msgDocument.money += reward;
    msgDocument.daily = Date.now() + cooldown;
    await msgDocument.save();
  
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
