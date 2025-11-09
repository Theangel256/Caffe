import users from "../utils/models/users.js";
import { getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, lang) {
    const usersDB = await getOrCreateDB(users, { userID: message.author.id });
    if (!usersDB) return message.channel.send(lang.dbError);
    let { marryId, marryTag } = usersDB;
    
  if (!marryId) return message.channel.send(lang.commands.divorce.nothing);
  message.channel.send(lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, usersDB.marryTag));

  await users.deleteOne({ marryTag: marryTag, marryId: marryId });
};

export const help = {
  name: "divorce",
  description:
    "Usa este comando para divorciarte de quien te hirio, si tienes a alguien que te hirio",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
