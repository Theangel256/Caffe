const { generateKey, getOrCreateDB } = require("../functions");
const keySystem = require("../models/keys");
module.exports.run = async (client, message) => {
  const license = generateKey();
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false, license: "" });
  if (!keysDB) return message.channel.send("I have an error while trying to access to the database, please try again later.");
  
  keysDB.license = license; 
  keysDB.enable = false;
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
