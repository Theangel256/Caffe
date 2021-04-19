const guildSystem = require('../structures/models/guilds');
module.exports = async (client, channel) => {
	if (channel.type === 'dm') return;
	const dbMsgModel = await guildSystem.findOne({
		guildID: channel.guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	const canal = client.channels.resolve(channelLogs);
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:white_check_mark: 」• Canal Creado**')
		.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setColor('GREEN')
		.addField('Tipo', '`' + channel.type + '`', true)
		.addField('Nombre', '`' + channel.name + '`', true)
		.addField('Creado', '`' + channel.createdAt.toDateString() + '`', true)
		.addField('ID', '`' + channel.id + '`', true)
		.setTimestamp()
		.setFooter(`•${channel.guild.name}•`, client.user.displayAvatarURL({ dynamic:true }), true);
	if(canal) return canal.send(logEmbed);
};
