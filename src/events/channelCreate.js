module.exports = async (client, channel) => {
	const opciones = new client.database('opciones');
	if (channel.type === 'dm') return;
	const logchannel = await opciones.get(`${channel.guild.id}.channels.logs`),
		canal = client.channels.resolve(logchannel);
	if(!canal) return;
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
	canal.send(logEmbed);
};
