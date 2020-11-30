const db = require('quick.db')
module.exports = (client, channel) => {
	const guilds = new db.table('guilds')
	if (channel.type === 'dm') return;
	const logchannel = guilds.get(`${channel.guild.id}.channels.logs`);
	const canal = client.channels.resolve(logchannel);
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
