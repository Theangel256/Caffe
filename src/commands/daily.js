const moment = require('moment');
const { getData } = require('../structures/functions/databaseManager');
 require('moment-duration-format');
const SystsemEconomy = require('../structures/models/SystemEconomy');
module.exports.run = async (client, message) => {
	const lang = client.lang.commands.daily;
	const total = 1200;
	const cooldown = await getData({ userID: message.author.id}, "SystemEconomy");
	if(!cooldown.daily) await SystsemEconomy.updateOne({ userID: message.author.id}, {daily: Date.now() + 86400000}) 
	else{	
		const tiempo = await cooldown.get(`${message.author.id}.daily`),	
			duracion = moment.duration(tiempo - Date.now()).format(' D [d], H [hrs], m [m], s [s]');	
		if (Date.now() < tiempo) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));	
	}
	let data = await SystsemEconomy.findOne({ userID: message.author.id })
	if(!data) await SystsemEconomy.updateOne({ userID: message.author.id }, {money: 200})
	await SystsemEconomy.updateOne({ userID: message.author.id }, {$inc: {money: total}}) 
	message.channel.send(lang.sucess.replace(/{total}/gi, total.toLocaleString()));

};
module.exports.help = {
	name: 'daily',
	description: 'Cada 24h usa este comando para ganar una paga diaria!',
}
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
}