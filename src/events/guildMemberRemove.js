const Zeew = require('zeew');
const guildSystem = require('../structures/models/guilds');
module.exports = async (client, member) => {
	const dbMsgModel = await guildSystem.findOne({
		guildID: member.guild.id,
	});
	const { channelLogs, goodbyeBackground, channelGoodbye } = dbMsgModel;
	const canal = client.channels.resolve(channelLogs);
	const robot = { true: 'Si', false: 'No' };
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:x:」 • Miembro Dejado**')
		.setColor('RED')
		.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setFooter(`ID: ${member.user.id}`, client.user.displayAvatarURL({ dynamic:true }))
		.setTimestamp()
		.addField('**「:boy: 」• Nombre**', member.user.username, true)
		.addField('**「:family_wwg:」• Total de miembros**', member.guild.members.cache.filter(x => !x.user.bot).size, true)
		.addField('**「:calendar:」• Unido el**', member.joinedAt.toDateString(), true)
		.addField('**「:robot:」• Bot?**', robot[member.user.bot], true);
	canal.send(logEmbed);
	const fondo = goodbyeBackground.exists()
		? goodbyeBackground
		: 'https://i.imgur.com/yS9KGBK.jpg';
	const wel = new Zeew.Bienvenida()
		.token('607cd872697aa7ff1648578e')
		.estilo('classic')
		.avatar(member.user.displayAvatarURL({ format: 'png' }))
		.fondo(fondo)
		.colorTit('#FF3DB0')
		.titulo('Bienvenid@')
		.colorDesc('#fff')
		.descripcion('Tenemos un nuevo usuario');
	const img = await Zeew.WelcomeZeew(wel);
	const attachment = new client.Discord.MessageAttachment(img, 'img.gif');
	const goodbye = client.channels.resolve(channelGoodbye);
	if(goodbye) return goodbye.send(attachment);
};
