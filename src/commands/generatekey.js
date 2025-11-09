import { generateKey, getOrCreateDB } from "../utils/functions.js";
import keySystem from "../utils/models/keys.js";
  
export async function run(client, message, lang) {
  const license = generateKey();
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id }, { enable: false });
  if (!keysDB) return message.channel.send(lang.dbError);
  
  keysDB.license = license;
  await keysDB.save();

  message.channel.send("Generada! (La licencia es de 30 dias)\nNo se contaran los dias mientras no la actives, revisa tu md");
  message.author.send(license);
};
export const help = {
  name: "generatekey",
  description: "",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};
