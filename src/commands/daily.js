const moment = require('moment'); require('moment-duration-format');
module.exports.run = async (client, message) => {
	const economia = new client.database('economia'),
		cooldown = new client.database('cooldown'),
		lang = client.lang.commands.daily;
	if(!cooldown.has(`${message.author.id}.daily`)) {cooldown.set(`${message.author.id}.daily`, Date.now() + 86400000);}
	else{
		const tiempo = await cooldown.get(`${message.author.id}.daily`),
			duracion = moment.duration(tiempo - Date.now()).format(' D [d], H [hrs], m [m], s [s]');
		if (Date.now() < tiempo) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
	}
	const total = 1200;
	if(!economia.has(`${message.author.id}.dinero`)) economia.set(`${message.author.id}.dinero`, 200);
	economia.add(`${message.author.id}.dinero`, total);
	message.channel.send(lang.sucess.replace(/{total}/gi, total.toLocaleString()));

};
module.exports.help = {
	name: 'daily',
	description: 'Cada 24h usa este comando para ganar una paga diaria!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};