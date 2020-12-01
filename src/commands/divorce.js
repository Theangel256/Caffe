const db = require('quick.db')
module.exports.run = (client, message) => {
	const marrys = new db.table('marrys')
	let data = marrys.get(`${message.author.id}`);
	if(!marrys.has(`${message.author.id}`)) return message.channel.send(client.lang.commands.divorce.nothing);
	message.channel.send(client.lang.commands.divorce.sucess.replace(/{esposa.tag}/gi, data.tag));
	data.delete(`${message.author.id}`, { tag: data.tag, id: data.id});
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