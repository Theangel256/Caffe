module.exports = async (client, role) => {
	const opciones = new client.database('opciones');
	const logchannel = await opciones.get(`${role.guild.id}.channels.logs`);
	const traduccion = { false: 'No', true: 'Si' };
	const logginChannel = client.channels.resolve(logchannel);
	if(!logginChannel) return;
	const rolembed = new client.Discord.MessageEmbed()
		.setTitle('**「:x: 」Rol Borrado**')
		.setColor('RED')
		.addField('Nombre:', role.name, true)
		.addField('ID:', role.id, true)
		.addField('Color:', role.hexColor, true)
		.addField('Mencionable:', traduccion[role.mentionable], true)
		.addField('Permisos:', role.permissions.bitfield, true)
		.addField('Creado:', role.createdAt.toDateString(), true)
		.setTimestamp()
		.setFooter(`•${role.guild.name}•`, client.user.displayAvatarURL({ dynamic:true }), true);
	logginChannel.send(rolembed);
};
