const keySystem = require("../utils/models/keys");;
const { getOrCreateDB } = require("../utils/functions.js");
module.exports.run = async (client, message, args) => {
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false, license: "", time: 0 });
  if (!keysDB) return message.channel.send(client.lang.dbError);

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
