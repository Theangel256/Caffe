module.exports.run = async (client, message) => {
	const db = new client.database('marrys');
	if(!db.has(`${message.author.id}.id`)) return message.channel.send(client.lang.commands.divorce.nothing);
	const esposaTag = await db.get(`${message.author.id}.tag`);
	const esposaId = await db.get(`${message.author.id}.id`);
	message.channel.send(client.lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, esposaTag));
	db.delete(esposaId);
	db.delete(message.author.id);
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