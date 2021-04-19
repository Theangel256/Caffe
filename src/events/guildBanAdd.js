const guildSystem = require('../structures/models/guilds');
module.exports = async (client, guild, user) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	const canal = client.channels.resolve(channelLogs);
	const robot = { true: 'Si', false: 'No' };
	if (!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
	guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(logs => {
		const userID = logs.entries.first().executor.id;
		const msgChannel = new client.Discord.MessageEmbed()
			.setTitle('**「:x:」 • Miembro Baneado**')
			.setColor('RED')
			.addField('**「:boy: 」• Nombre**', user.tag, true)
			.addField('**「:robot:」• Bot?**', robot[user.bot], true)
			.addField('Por', `<@${userID}>`, true)
			.setTimestamp()
			.setFooter(guild.name, guild.iconURL({ dynamic:true }));
		if(canal) return canal.send(msgChannel);
	});
};
