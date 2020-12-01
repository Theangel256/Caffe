const db = require('quick.db')
const { getMember } = require('../structures/functions');
module.exports.run = async (client, message, args) => {
	const economia = new db.table('economy'),
		member = getMember(message, args, true);
	if(!economia.has(`${member.user.id}.dinero`)) economia.set(`${member.user.id}.dinero`, 200);
	const dinero = await economia.get(`${member.user.id}.dinero`),
		lang = client.lang.commands.balance;
	message.channel.send(message.author.id === member.user.id
		? lang.no_user.replace(/{money}/gi, dinero.toLocaleString())
		: lang.user.replace(/{user.username}/gi, member.user.username).replace(/{money}/gi, dinero.toLocaleString()));
};
module.exports.help = {
	name: 'balance',
	aliases: ['bal', 'money'],
	description: 'Muestra el dinero que tienes en el bot',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};