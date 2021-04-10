// const db = require('quick.db');
module.exports = (client, channel) => {
	if (channel.type === 'dm') return;
	// const guilds = new db.table('guilds');
	// const logchannel = guilds.fetch(`${channel.guild.id}.channels.logs`);
	// /const canal = client.channels.resolve(logchannel);
	// if(!canal) return;
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:x:」• Canal Removido**')
		.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setColor('RED')
		.addField('Tipo', '`' + channel.type + '`', true)
		.addField('Nombre', '`' + channel.name + '`', true)
		.addField('Creado', '`' + channel.createdAt.toDateString() + '`', true)
		.addField('ID', '`' + channel.id + '`', true)
		.setTimestamp()
		.setFooter(`•${channel.guild.name}•`, client.user.displayAvatarURL({ dynamic:true }), true);
	// canal.send(logEmbed);
};
