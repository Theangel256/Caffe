const guildSystem = require('../structures/models/guilds');
module.exports = async (client, role) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: role.guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	const logginChannel = client.channels.resolve(channelLogs);
	const rolembed = new client.Discord.MessageEmbed()
		.setTitle('**「:white_check_mark: 」Rol Creado**')
		.setColor('GREEN')
		.addField('Nombre:', role.name, true)
		.addField('ID:', role.id, true)
		.setTimestamp()
		.setFooter(`•${role.guild.name}•`, client.user.displayAvatarURL({ dynamic:true }), true);
	if(logginChannel) return logginChannel.send(rolembed);
};