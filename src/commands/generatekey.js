const { generateKey } = require("../functions");
const keySystem = require("../models/keys");
module.exports.run = async (client, message) => {
  const license = generateKey();
  const msgDocument = await keySystem
    .findOne({ guildID: message.guild.id })
    .catch(console.error);
  try {
    const dbMsg = await new keySystem({
      guildID: message.guild.id,
      license,
      enable: false,
    });
    var dbMsgModel = await dbMsg.save();
  } catch (err) {
    console.log(err);
  }
  dbMsgModel = msgDocument;
  message.channel.send(
    "Generada! (La licencia es de 30 dias)\nNo se contaran los dias mientras no la actives, revisa tu md"
  );
  message.author.send(license);
};
module.exports.help = {
  name: "generatekey",
  description: "",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
