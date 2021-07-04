const users = require('../structures/models/users');
module.exports.run = (client, message) => {
  const msgDocument = await users.findOne({ userID: message.author.id }).catch(console.error);
	let data = msgDocument;
  console.log(msgDocument);
	if(!data) return message.channel.send(client.lang.commands.divorce.nothing);
	message.channel.send(client.lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, data.tag));
	await data.deleteOne({ tag: data.tag, id: data.id });
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
