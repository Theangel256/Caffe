const economySystem = require("../utils/models/users");
const { getOrCreateDB } = require("../utils/functions.js");
module.exports.run = async (client, message, args) => {

  const economy = await getOrCreateDB(economySystem, { userID: message.author.id });
  if (!economy) return message.channel.send(client.lang.dbError);

  const cantidad = args.join(" ");
  const random = Math.ceil(Math.random() * 8);
  let all = economy.money;
  if (!cantidad)
    return message.channel.send(client.lang.commands.gamble.no_quantity);
  if (cantidad.toLowerCase() === "all" || cantidad.toLowerCase() === "todo") {
    if (all < 50) return message.channel.send(client.lang.commands.gamble.insufficient_money);

    if (random === 1 || random === 2 || random === 3 || random === 4) {
      const total = parseInt(all * 0.75);
      await economy.updateOne({ money: total });
      return message.channel.send(client.lang.commands.gamble.success.replace(/{all}/gi,total.toLocaleString()));
    } else {
      await dbMsgModel.updateOne({ money: economy.money - all });
      return message.channel.send(client.lang.commands.gamble.unsuccess.replace(/{all}/gi,all.toLocaleString()));
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
      await economy.updateOne({ money: economy.money + total });
      return message.channel.send(
        client.lang.commands.gamble.success.replace(
          /{all}/gi,
          total.toLocaleString()
        )
      );
    } else {
      await economy.updateOne({ money: parseInt(economy.money - cantidad) });
      return message.channel.send(client.lang.commands.gamble.unsuccess.replace(/{all}/gi,parseInt(cantidad.toLocaleString())));
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
