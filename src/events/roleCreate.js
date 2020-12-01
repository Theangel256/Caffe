const db = require('quick.db');
module.exports = async (client, role) => {
	const guilds = new db.table('guilds');
	const logchannel = await guilds.fetch(`${role.guild.id}.channels.logs`);
	const logginChannel = client.channels.resolve(logchannel);
	if(!logginChannel) return;
	const rolembed = new client.Discord.MessageEmbed()
		.setTitle('**「:white_check_mark: 」Rol Creado**')
		.setColor('GREEN')
		.addField('Nombre:', role.name, true)
		.addField('ID:', role.id, true)
		.setTimestamp()
		.setFooter(`•${role.guild.name}•`, client.user.displayAvatarURL({ dynamic:true }), true);
	logginChannel.send(rolembed);
};
