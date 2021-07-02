const guildSystem = require('../structures/models/guilds');
module.exports = async (client, role) => {
	const msgDocument = await guildSystem.findOne({
		guildID: role.guild.id,
	}).catch(err => console.log(err));
	if (!msgDocument) {
		try {
			const dbMsg = await new guildSystem({ guildID: message.guild.id, prefix: process.env.prefix, language: 'en', role: false, kick: false, ban: false });
			var dbMsgModel = await dbMsg.save();
		} catch (err) { console.log(err); }
	} else {
		dbMsgModel = msgDocument;
	}
	const { channelLogs } = dbMsgModel;
	const traduccion = { false: 'No', true: 'Si' };
	const logginChannel = client.channels.resolve(channelLogs);
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
	if(logginChannel) return logginChannel.send(rolembed);
};
