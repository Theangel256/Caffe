module.exports.run = (client, message, args) => {
	const lang = client.lang.commands.eightBall;
	const pregunta = args.join(' '),
		result = Math.ceil(Math.random() * lang.ball.length),
		embed = new client.Discord.MessageEmbed();
	if (!pregunta[0]) return message.channel.send(lang.no_args);
	embed.setTitle(lang.title)
		.addField(lang.field1, `${pregunta}`)
		.addField(lang.field2, lang.ball[result])
		.setColor(0x00ffff);
	message.channel.send(embed);
};
module.exports.help = {
	name: '8ball',
	description: 'Preguntale algo a Caffedivinius',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 3,
	cooldown: 20000,
};