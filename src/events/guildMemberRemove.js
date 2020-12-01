const db = require('quick.db');
const marsnpm = require('marsnpm');
module.exports = async (client, member) => {
	const guilds = new db.table('guilds');
	const logchannel = await guilds.get(`${member.guild.id}.channels.logs`),
		robot = { true: 'Si', false: 'No' },
		channel = client.channels.resolve(logchannel);
	if(!channel) return;
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:x:」 • Miembro Dejado**')
		.setColor('RED')
		.setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setFooter(`ID: ${member.user.id}`, client.user.avatarURL({ dynamic:true }))
		.setTimestamp()
		.addField('**「:boy: 」• Nombre**', member.user.username, true)
		.addField('**「:family_wwg:」• Total de miembros**', member.guild.members.cache.filter(x => !x.user.bot).size, true)
		.addField('**「:calendar:」• Unido el**', member.joinedAt.toDateString(), true)
		.addField('**「:robot:」• Bot?**', robot[member.user.bot], true);
	channel.send(logEmbed);

	const fondo = guilds.has(`${member.guild.id}.fondo.goodbye`)
		? guilds.get(`${member.guild.id}.fondo.goodbye`)
		: 'http://i.imgur.com/0YrfJgx.jpg';
	const goodbyeChannel = guilds.get(`${member.guild.id}.channels.goodbye`);
	if(!goodbyeChannel) return;
	const img = await marsnpm.bienvenida2(member.user.displayAvatarURL({ format: 'jpg' }), member.user.username, 'Adios, Esperemos que la hayas pasado bien', fondo);
	goodbyeChannel.send({ files: [img] });
};
