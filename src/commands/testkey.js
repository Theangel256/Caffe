const keySystem = require("../models/keys");
const { getOrCreateDB } = require("../functions");
module.exports.run = async (client, message, args) => {
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false, license: "", time: 0 });
  if (!keysDB) return message.channel.send("I have an error while trying to access to the database, please try again later.");

  if (!args[0]) return message.channel.send({content: `Tienes que otorgarme una licencia para poder validar tu subscripcion\nPuedes obtenerla [Aquí](${process.env.URL}/premium)`,});

    keySystem.collection.dropIndex("enable_1")
    await keysDB.save();
    return message.channel.send("Premium Activado para este servidor!");
};
module.exports.help = {
  name: "testkey",
  description: "",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
