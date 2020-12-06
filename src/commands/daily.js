const moment = require('moment'); require('moment-duration-format');
const db = require('quick.db');
module.exports.run = async (client, message) => {
	const economy = new db.table('economy');
	const lang = client.lang.commands.daily;
	const total = 1200;
	if(!economy.has(`${message.author.id}.daily`)) await economy.set(`${message.author.id}`, { daily: Date.now() + 86400000 }) 
	else{	
		const tiempo =  await economy.fetch(`${message.author.id}.daily`),	
			duracion = moment.duration(tiempo - Date.now()).format(' D [d], H [hrs], m [m], s [s]');	
		if (Date.now() < tiempo) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));	
	}
	let data = economy.has(`${message.author.id}.money`);
	if(!data) await economy.set(`${message.author.id}.money`, 200)
	economy.add(`${message.author.id}.money`, total)
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