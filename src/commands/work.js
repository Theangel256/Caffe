const commandcooldown = new Map(),
	moment = require('moment');
require('moment-duration-format');
// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args) => {
	const economia = new client.database('economia');
	if (commandcooldown.has(message.author.id)) {
		const cooldown = commandcooldown.get(message.author.id),
			duracion = moment.duration(cooldown - Date.now()).format('m [m], s [s]');
		if (Date.now() < cooldown) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
	}
	const tr = new client.Discord.MessageEmbed()
		.setTitle('Estás trabajando')
		.setDescription('¡Aguarda unos momentos, estas trabajando!')
		.setColor('GREEN');
	message.channel.send(tr).then(async m => {
		setTimeout(() => {
			Math.ceil(Math.random() * (1001 - 100)) + 200;
			const random = Math.ceil(Math.random() * (1001 - 100)) + 200;
			setTimeout(() => {
				m.delete();
			}, 2000);
			if (!economia.has(`${message.author.id}.dinero`)) economia.set(`${message.author.id}.dinero`, 200);

			economia.add(`${message.author.id}.dinero`, random);
			const embed = new client.Discord.MessageEmbed()
				.setColor('RANDOM')
				.setTitle(`¡Adivina quien ha trabajado, pues: **${message.author.username}**`)
				.addField('**Tu dinero:**', '``' + random + '``');

			m.channel.send(embed);
		}, 20000);
	});

	commandcooldown.set(message.author.id, Date.now() + 300000);
};
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