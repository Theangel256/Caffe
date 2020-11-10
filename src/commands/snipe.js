module.exports.run = (client, message) => {
	const msg = client.snipes.get(message.channel.id);
	if(!msg) return message.channel.send('No hay mensajes borrados actualmente');

	const embed = new client.Discord.MessageEmbed()
		.setAuthor(`Borrado Por ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic:true }))
		.setDescription(msg.content);
	if(msg.image) embed.setImage(msg.image);

	return message.channel.send(embed);
};
module.exports.help = {
	name: 'snipe',
	description: 'Ve los mensajes borrados recientemente de un canal',
};
module.exports.requirements = {
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 2,
	cooldown: 6e4,
};