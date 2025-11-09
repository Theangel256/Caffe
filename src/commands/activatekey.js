import keySystem from "../utils/models/keys.js";
import { getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, args) {
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false, license: "" });
  if (!keysDB) return message.channel.send(client.lang.dbError);

  if (!args[0]) return message.channel.send({content: `Tienes que otorgarme una licencia para poder validar tu subscripcion\nPuedes obtenerla [Aquí](${process.env.PUBLIC_URL}/premium)`,});

  if (keysDB.license === args[0]) {
    keysDB.enable = true 
    keysDB.time = Date.now() + 2.592e9
    await keysDB.save();
    return message.channel.send("Premium Activado para este servidor!");
  } else {
    return message.channel.send("Licencia invalida!");
  }
};
export const help = {
  name: "activatekey",
  description: "",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
