const economySystem = require("../models/users");
module.exports.run = async (client, message, args) => {
  const msgDocument = await economySystem
    .findOne({ userID: message.author.id })
    .catch(console.error);
  if (!msgDocument) {
    try {
      const dbMsg = await new economySystem({
        userID: message.author.id,
        money: 200,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const cantidad = args.join(" ");
  const random = Math.ceil(Math.random() * 8);
  let { money } = dbMsgModel;
  if (!cantidad)
    return message.channel.send(client.lang.commands.gamble.no_quantity);
  if (cantidad.toLowerCase() === "all" || cantidad.toLowerCase() === "todo") {
    if (all < 50)
      return message.channel.send(
        client.lang.commands.gamble.insufficient_money
      );
    if (random === 1 || random === 2 || random === 3 || random === 4) {
      const total = parseInt(all * 0.75);
      await dbMsgModel.updateOne({ money: total });
      return message.channel.send(
        client.lang.commands.gamble.success.replace(
          /{all}/gi,
          total.toLocaleString()
        )
      );
    } else {
      await dbMsgModel.updateOne({ money: money - all });
      return message.channel.send(
        client.lang.commands.gamble.unsuccess.replace(
          /{all}/gi,
          all.toLocaleString()
        )
      );
    }
  } else if (isNaN(cantidad)) {
    return message.channel.send(client.lang.commands.gamble.no_number);
  } else if (cantidad < 50) {
    return message.channel.send(client.lang.commands.gamble.minimum);
  } else {
    if (all < cantidad)
      return message.channel.send(client.lang.commands.gamble.bit);
    if (random === 1 || random === 2 || random === 3 || random === 4) {
      const total = parseInt(cantidad * 0.75);
      await dbMsgModel.updateOne({ money: money + total });
      return message.channel.send(
        client.lang.commands.gamble.success.replace(
          /{all}/gi,
          total.toLocaleString()
        )
      );
    } else {
      await dbMsgModel.updateOne({ money: parseInt(money - cantidad) });
      return message.channel.send(
        client.lang.commands.gamble.unsuccess.replace(
          /{all}/gi,
          parseInt(cantidad.toLocaleString())
        )
      );
    }
  }
};
module.exports.help = {
  name: "gamble",
  description: "Apuesta todo tu dinero, o lo cuanto quieras!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
