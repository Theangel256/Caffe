module.exports = async (client, role) => {
	const opciones = new client.database('opciones');
	const logchannel = await opciones.get(`${role.guild.id}.channels.logs`);
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
