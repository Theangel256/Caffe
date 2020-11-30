const { getData } = require("../structures/functions/databaseManager");
const marrySystem = require('../structures/models/marrySystem')
module.exports.run = async (client, message) => {
	let db = await getData({ userID: message.author.id}, "marrySystem");
	let data = await marrySystem.findOne({ userID: message.author.id })
	if(!data) return message.channel.send(client.lang.commands.divorce.nothing);
	message.channel.send(client.lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, db.marryTag));
	marrySystem.deleteMany( { "marryTag" : db.marryTag, "marryId" : db.marryId } );
};
module.exports.help = {
	name: 'divorce',
	description: 'Usa este comando para divorciarte de quien te hirio, si tienes a alguien que te hirio',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};