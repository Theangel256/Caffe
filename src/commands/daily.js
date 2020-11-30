const SystsemEconomy = require('../structures/models/SystemEconomy');
module.exports.run = async (client, message) => {
	const lang = client.lang.commands.daily;
	const total = 1200;
	let data = await SystsemEconomy.findOne({ userID: message.author.id })
	if(!data) await SystsemEconomy.updateOne({ userID: message.author.id }, {money: 200})
	await SystsemEconomy.updateOne({ userID: message.author.id }, {$inc: {money: total}}) 
	message.channel.send(lang.sucess.replace(/{total}/gi, total.toLocaleString()));

};
module.exports.help = {
	name: 'daily',
	description: 'Cada 24h usa este comando para ganar una paga diaria!',
}
.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
}
.limits = {
	rateLimit: 1,
	cooldown: 86400000
}