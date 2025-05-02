const economySystem = require("../models/users");
const { getMember, getOrCreateDB } = require("../functions");
module.exports.run = async (client, message, args) => {
  const lang = client.lang.commands.balance;
  const member = getMember(message, args, true);
  const economy = await getOrCreateDB(economySystem, { userID: member.user.id });
  if (!economy) return message.channel.send("I have an error while trying to access to the database, please try again later.");
  message.channel.send(
    message.author.id === member.user.id
      ? lang.no_user.replace(/{money}/gi, economy.money.toLocaleString())
      : lang.user.replace(/{user.username}/gi, member.user.username).replace(/{money}/gi, economy.money.toLocaleString())
  );
};

module.exports.help = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Muestra el dinero que tienes en el bot",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
