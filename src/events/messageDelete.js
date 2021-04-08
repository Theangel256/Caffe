
// const db = require('quick.db');
module.exports = async (client, message) => {
	// const guilds = new db.table('guilds');
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author,
		image: message.attachments.first() ? message.attachments.first().proxyURL : null,
	});
	// const logchannel = await guilds.fetch(`${message.guild.id}.channels.logs`),
		// logginChannel = client.channels.resolve(logchannel);
	// if(!logginChannel) return;
	if(!message.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
	const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first());
	let user = '';
	if (entry.extra.channel.id === message.channel.id && (entry.target.id === message.author.id)
&& (entry.createdTimestamp > (Date.now() - 5000)) && entry.extra.count >= 1) {
		user = entry.executor;
	}
	else {
		user = message.author;
	}
	if(message.content) {
		const logEmbed = new client.Discord.MessageEmbed()
			.setTitle('**「:wastebasket:」** Mensaje Borrado')
			.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
			.setFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic:true }))
			.setTimestamp()
			.setColor('RED')
			.addField('En', message.channel, true);
		if(!user.bot) {
			logEmbed.addField('Por', `<@${user.id}>`, true);
		}
		logEmbed.addField('Mensaje', message.content, true);
		// logginChannel.send(logEmbed);
	}
	else if(message.attachments.size > 0) {
		const Attachs = (message.attachments).array();
		Attachs.forEach(m => {
			const embed = new client.Discord.MessageEmbed()
				.setTitle('**「:wastebasket:」** Imagen Borrada')
				.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
				.setFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic:true }))
				.setColor('RED')
				.addField('En', message.channel, true)
				.addField('Por', `<@${user.id}>`, true)
				.setImage(m.proxyURL);
			// logginChannel.send(embed);
		});
	}
};