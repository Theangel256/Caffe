const guildSystem = require('../structures/models/guilds');
module.exports = async (client, message) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: message.guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	const logginChannel = client.channels.resolve(channelLogs);
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
	const embed = new client.Discord.MessageEmbed()
		.setTitle('**「:wastebasket:」** Mensaje Borrado')
		.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic:true }))
		.setFooter(`ID: ${message.author.id}`, message.author.displayAvatarURL({ dynamic:true }))
		.setTimestamp()
		.setColor('RED')
		.addField('En', message.channel, true);
	if(!user.bot) {
		embed.addField('Por', `<@${user.id}>`, true);
	}
	if(message.content) {
		embed.addField('Mensaje', message.content, true);
	}
	if(message.attachments.size > 0) {
		const Attachs = (message.attachments).array();
		Attachs.forEach(m => {
			embed.setTitle('**「:wastebasket:」** Imagen Borrada')
				.setImage(m.proxyURL);
			if(logginChannel) return logginChannel.send(embed);
		});
	}
};