const guildSystem = require('../structures/models/guilds');
module.exports = async (client, oldMember, newMember) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: oldMember.guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	if(!oldMember.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;
	const entry = await oldMember.guild.fetchAuditLogs({ type: 'MEMBER_UPDATE' }).then(audit => audit.entries.first());
	const channel = client.channels.resolve(channelLogs);
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
		if(channel) return channel.send(msgChannel);
	}
};