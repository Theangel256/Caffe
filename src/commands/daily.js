const moment = require("moment");
require("moment-duration-format");
const economySystem = require("../structures/models/users");
module.exports.run = async (client, message) => {
  const lang = client.lang.commands.daily;
  const msgDocument = await economySystem
    .findOne({ userID: message.author.id })
    .catch(console.error);
  if (!msgDocument) {
    try {
      const dbMsg = await new economySystem({
        userID: message.author.id,
        money: 200,
        daily: Date.now() + 86400000,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const total = 1200;
  const duracion = moment
    .duration(tiempo - Date.now())
    .format(" D [d], H [hrs], m [m], s [s]");
  if (Date.now() < tiempo)
    return message.channel.send(
      client.lang.wait.replace(/{duration}/gi, duracion)
    );
  await dbMsgModel.updateOne({ money: total });
  message.channel.send(
    lang.sucess.replace(/{total}/gi, total.toLocaleString())
  );
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
