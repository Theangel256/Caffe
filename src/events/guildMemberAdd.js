const marsnpm = require('marsnpm');
module.exports = async (client, member) => {
	const cooldown = new client.database('cooldown');
	const mutedRole = member.guild.roles.cache.find(r => r.name == 'Muted');
	if(cooldown.has(member.id)) member.roles.add(mutedRole.id)
	const opciones = new client.database('opciones');
	const logchannel = await opciones.get(`${member.guild.id}.channels.logs`),
		robot = { true: 'Si', false: 'No' },
		channel = client.channels.resolve(logchannel);
	if(!channel) return;
	const logEmbed = new client.Discord.MessageEmbed()
		.setTitle('**「:white_check_mark:」 • Miembro Unido**')
		.setColor('BLUE').setDescription('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬')
		.setFooter(`ID: ${member.user.id}`, member.user.displayAvatarURL({ dynamic:true }))
		.setTimestamp()
		.addField('**「:boy: 」• Nombre**', member.user.username, true)
		.addField('**「:family_wwg:」• Total de miembros**', member.guild.members.cache.filter(x => !x.user.bot).size, true)
		.addField('**「:calendar:」• Creado el**', member.user.createdAt.toDateString(), true)
		.addField('**「:robot:」• Bot?**', robot[member.user.bot], true);
	channel.send(logEmbed);
	const role = opciones.get(`${member.guild.id}.role`);
	try {
		member.roles.add(role);
	}
	catch (e) { console.log(e.message); }

	const fondo = opciones.has(`${member.guild.id}.fondo.welcome`)
		? await opciones.get(`${member.guild.id}.fondo.welcome`)
		: 'http://i.imgur.com/0YrfJgx.jpg';
	const img = await marsnpm.bienvenida2(member.user.displayAvatarURL({ format: 'jpg' }), member.user.username, 'Bienvenid@ a nuestra comunidad!', fondo);
	const welcome = await opciones.get(`${member.guild.id}.channels.welcome`);
	if(!welcome) return;
	welcome.send({ files: [img] });
};
