const economySystem = require("../structures/models/users");
const { getMember } = require("../structures/functions");
module.exports.run = async (client, message, args) => {
  const lang = client.lang.commands.balance;
  const member = getMember(message, args, true);
  const msgDocument = await economySystem
    .findOne({ userID: member.user.id })
    .catch(console.error);
  if (!msgDocument) {
    try {
      const dbMsg = await new economySystem({
        userID: member.user.id,
        money: 200,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  let { money } = dbMsgModel;
  message.channel.send(
    message.author.id === member.user.id
      ? lang.no_user.replace(/{money}/gi, dinero.toLocaleString())
      : lang.user
          .replace(/{user.username}/gi, member.user.username)
          .replace(/{money}/gi, dinero.toLocaleString())
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
