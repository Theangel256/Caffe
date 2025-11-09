import keySystem from "../utils/models/keys.js";
import { getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, args, lang) {
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false, license: "", time: 0 });
  if (!keysDB) return message.channel.send(lang.dbError);

  if (!args[0]) return message.channel.send({content: `Tienes que otorgarme una licencia para poder validar tu subscripcion\nPuedes obtenerla [Aquí](${process.env.PUBLIC_URL}/premium)`,});

    keySystem.collection.dropIndex("enable_1")
    await keysDB.save();
    return message.channel.send("Premium Activado para este servidor!");
};
export const help = {
  name: "testkey",
  description: "",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
