const db = require('quick.db');
module.exports = async (client, guild, user) => {
	const guilds = new db.table('guilds');
	const logchannel = await guilds.get(`${guild.id}.channels.logs`),
		robot = { true: 'Si', false: 'No' };
	const logginChannel = client.channels.resolve(logchannel);
	if(!logginChannel) return;
	if (!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
	guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' }).then(logs => {
		const userID = logs.entries.first().executor.id;
		if (userID === client.user.id) return;
		const msgChannel = new client.Discord.MessageEmbed()
			.setTitle('**「:x:」 • Miembro Desbaneado**')
			.setColor('RED')
			.addField('**「:boy: 」• Nombre**', user.tag, true)
			.addField('**「:robot:」• Bot?**', robot[user.bot], true)
			.addField('Por', `<@${userID}>`, true)
			.setTimestamp()
			.setFooter(guild.name, guild.iconURL({ dynamic:true }));
		logginChannel.send(msgChannel);
	});
};

