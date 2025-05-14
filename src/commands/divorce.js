const users = require("../models/users");
const { getOrCreateDB } = require("../functions");
module.exports.run = async (client, message) => {
    const usersDB = await getOrCreateDB(users, { userID: message.author.id });
    if (!usersDB) return message.channel.send("I have an error while trying to access to the database, please try again later.");
    let { marryId, marryTag } = usersDB;
    
  if (!marryId) return message.channel.send(client.lang.commands.divorce.nothing);
  message.channel.send(client.lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, usersDB.marryTag));

  await users.deleteOne({ marryTag: marryTag, marryId: marryId });
};

module.exports.help = {
  name: "divorce",
  description:
    "Usa este comando para divorciarte de quien te hirio, si tienes a alguien que te hirio",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
