// const db = require('quick.db');
module.exports = async (client, oldMessage, newMessage) => {
	// const guilds = new db.table('guilds');
	if (oldMessage.content === newMessage.content) return;
	// const logchannel = await guilds.fetch(`${newMessage.guild.id}.channels.logs`),
	// canal = client.channels.resolve(logchannel);
	// if(!canal) return;
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:writing_hand:」** Mensaje Editado (Click para ir al mensaje)')
		.setColor('BLUE').setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ dynamic:true }))
		.setURL(`http://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`);
	if(oldMessage.content) {
		logEmbed.addField('Antes', oldMessage.content, true);
	}
	logEmbed.addField('En:', oldMessage.channel, true);
	if(newMessage.content) {
		logEmbed.addField('Despues', newMessage.content, true);
	}
	logEmbed.setTimestamp()
		.setFooter(`ID: ${oldMessage.author.id}`);
	// canal.send(logEmbed);
};