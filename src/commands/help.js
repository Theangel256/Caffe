module.exports.run = (client, message, args) => {
	if(args[0] && client.commands.get(args[0])) {
		const cmd = client.commands.get(args[0]);
		const embed = new client.Discord.MessageEmbed()
			.setAuthor(`${cmd.help.name} | Help`, client.user.displayAvatarURL())
			.setColor(0x00ffff)
			.setDescription(`**Name:** ${cmd.help.name}\n**Description:** ${cmd.help.description}`);
		return message.channel.send(embed);
	}

	const embed = new client.Discord.MessageEmbed()
		.setAuthor(`Help | ${client.user.username} `, client.user.displayAvatarURL())
		.setFooter(`•Caffe-bot.com• V ${require('../../package.json').version}`, client.user.displayAvatarURL({ dynamic:true }))
		.setDescription(client.commands.map(cmd => cmd.help.name).join(', '));
	return message.channel.send(embed);
};
module.exports.help = {
	name: 'help',
	aliases: ['cmds', 'commands'],
	description: 'obten ayuda de cuantos y cuales son los comandos de Caffe!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};