// const db = require('quick.db');
module.exports = async (client, oldMember, newMember) => {
	// const guilds = new db.table('guilds');
	if(!oldMember.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
	// const logchannel = await guilds.fetch(`${oldMember.guild.id}.channels.logs`),
		// entry = await oldMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' }).then(audit => audit.entries.first()),
		// channel = client.channels.resolve(logchannel);
	// if(!channel) return;
	if(oldMember.nickname !== newMember.nickname) {
		const user = entry.executor;
		const msgChannel = new client.Discord.MessageEmbed()
			.setTitle('**「:writing_hand:」 • Nickname Actualizado**')
			.setColor('BLUE')
			.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
			.setFooter(`ID: ${oldMember.user.id}`, oldMember.user.displayAvatarURL({ dynamic:true }))
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic:true }));
		if(oldMember.nickname !== null) {
			msgChannel.addField('Nickname anterior', oldMember.nickname, true);
		}
		msgChannel.addField('Nickname Actual', newMember.nickname === null ? newMember.user.username : newMember.nickname, true)
			.addField('Por', `<@${user.id}>`, true)
			.setTimestamp();
		// channel.send(msgChannel);
	}
};