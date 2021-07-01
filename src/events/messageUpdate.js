const guildSystem = require('../structures/models/guilds');
module.exports = async (client, oldMessage, newMessage) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: oldMessage.guild.id,
	}).catch(err => console.log(err));
	const { channelLogs } = dbMsgModel;
	if (oldMessage.content === newMessage.content) return;
	const logginChannel = client.channels.resolve(channelLogs);
	if(!logginChannel) return
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
	 logginChannel.send(logEmbed);
};