const economySystem = require("../utils/models/users");
const { getOrCreateDB } = require("../utils/functions.js");
const { EmbedBuilder } = require("discord.js");
module.exports.run = async (client, message) => {
  const reward = 150;
    const economy = await getOrCreateDB(economySystem, { userID: message.author.id });
    if (!economy) return message.channel.send(client.lang.dbErrorMessage);
    economy.money += reward;
    await economy.save();
    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Mina Rueca', iconURL: message.author.displayAvatarURL({ extension: 'png' }) })
    .setDescription(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50`)
    .setColor(message.guild.members.me.displayHexColor);
    return message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "mine",
  description: "trabaja duro para conseguir dinero!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["EMBED_LINKS"],
  ownerOnly: false,
};
module.exports.limits = {
  rateLimit: 1,
  cooldown: 300000,
};
