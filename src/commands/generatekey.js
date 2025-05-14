const { generateKey, getOrCreateDB } = require("../utils/functions.js");
const keySystem = require("../utils/models/keys");;
module.exports.run = async (client, message) => {
  const license = generateKey();
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false });
  if (!keysDB) return message.channel.send(client.lang.dbErrorMessage);
  
  keysDB.license = license;
  await keysDB.save();

  message.channel.send("Generada! (La licencia es de 30 dias)\nNo se contaran los dias mientras no la actives, revisa tu md");
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
