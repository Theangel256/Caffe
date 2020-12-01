const db = require('quick.db')
module.exports.run = async (client, message) => {
	const economy = new db.table('economy')
	let elements = ['100','75', '50'];
	let cacthElements = elements[Math.floor(elements.length * Math.random())];
	let jobs = ['Trabajas en una cafeteria y ganaste $', 'Trabajaste de repartidor de pizas y recibiste $', "Editaste un video de un YouTuber y te pago $"]
	let cacthJobs = jobs[Math.floor(elements.length * Math.random())];
	economy.add(`${message.author.id}.money`, cacthElements);
	return message.channel.send(`> ${cacthJobs}${cacthElements}`)
}
module.exports.help = {
	name: 'work',
	aliases: ['w'],
	description: 'trabaja duro para conseguir dinero!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 1,
	cooldown: 300000,
};