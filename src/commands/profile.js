const {getMember} = require('../structures/functions.js');
module.exports.run = async (client, message, args) => {
	const level_db = new client.database('niveles'),
		profile = new client.database('profile'),
		economia = new client.database('economia'),
		trofeos = new client.database('trofeos'),
		marry = new client.database('marrys'),
		lang = profile.has(`${message.author.id}.language`) ? await profile.get(`${message.author.id}.language`) : 'en';
	if(args[0]) {
		if (args[0].toLowerCase() === 'set') {
			const embed2 = new client.Discord.MessageEmbed()
				.setAuthor(lang === 'en' ? `${message.author.username} You should use it as follows.`
					: `${message.author.username} Debes de utilizarlo de la siguiente manera.`, message.author.displayAvatarURL())
				.setColor(message.guild.me.displayHexColor)
				.setDescription(lang === 'en'
					? '`' + client.prefix + 'set <action> <data>`\n\n**Available Shares**:\n`profile set desc <Personal Text>`\n`profile set lang es or en`'
					: '`' + client.prefix + 'set <acción> <dato>`\n\n**Acciones Disponibles**:\n`profile set desc <Texto Personal>`\n`profile set lang es ó en`');

			if (!args[1]) return message.channel.send(embed2);
			if(args[1].toLowerCase() === 'desc') {
				if(!args[2]) return message.channel.send(lang === 'en' ? '**:grey_exclamation: |** Write the description to be viewed on your profile' : '**:grey_exclamation: |** Escribe la descripción a ver en tu perfil');
				profile.set(`${message.author.id}.personalText`, args.slice(2).join(' '));
				return message.channel.send(lang === 'en' ? `Personal description set to: ${args.slice(2).join(' ')}` : `Descripción personal establecido a: ${args.slice(2).join(' ')}`);
			}
			else if(args[1].toLowerCase() === 'lang') {
				if(!args[2]) return message.channel.send(lang === 'en' ? '**:grey_exclamation: |** Write the language to be seen in your profile' : '**:grey_exclamation: |** Escribe el lenguaje a ver en tu perfil');
				if(!['es', 'en'].includes(args[2].toLowerCase())) return message.channel.send(lang === 'en' ? '**:grey_exclamation: |** It must be `es` or `en`' : '**:grey_exclamation: |** Debe ser `es` ó `en`.');
				profile.set(`${message.author.id}.language`, args.slice(2).join(' '));
				const langcode = profile.has(`${message.author.id}.language`) ? await profile.get(`${message.author.id}.language`) : 'en';
				return message.channel.send(langcode === 'en' ? `Profile language set to: ${args.slice(2).join(' ')}` : `Lenguaje del perfil establecido a: ${args.slice(2).join(' ')}`);
			}
			else{
				return message.channel.send(lang === 'en' ? 'Wrong choice!' : 'Opción Incorrecta!');
			}
		}
	}
	const member = getMember(message, args, true);
	if(member.user.bot) return message.channel.send(lang === 'en' ? 'Bots have no profile' : 'Los bots no tienen pefil');
	if(!level_db.has(`${message.guild.id}.${message.author.id}`)) level_db.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 0 });
	if(!economia.has(`${member.user.id}.dinero`)) economia.set(`${member.user.id}.dinero`, 200);
	if(!economia.has(`${member.user.id}.rep`)) economia.set(`${member.user.id}.rep`, 0);
	const dinero = await economia.get(`${member.user.id}.dinero`),
		reputation = await economia.get(`${member.user.id}.rep`),
		{ xp, lvl } = await level_db.get(`${message.guild.id}.${member.user.id}`);
	const embed = new client.Discord.MessageEmbed()
		.setAuthor(`Perfil de ${member.user.username}`, member.user.displayAvatarURL({ dynamic:true }))
		.setThumbnail(member.user.displayAvatarURL({ dynamic:true }))
		.setDescription(profile.has(`${member.user.id}.personalText`) ? await profile.get(`${member.user.id}.personalText`) : lang === 'en' ? 'Without description.' : 'Sin Descripción.')
		.addField(lang === 'en' ? ':dollar: Currencies' : ':dollar: Monedas', dinero.toLocaleString())
		.addField(lang === 'en' ? ':sparkles: Level' : ':sparkles: Nivel', `${lvl} (XP: ${xp})`, true)
		.addField(lang === 'en' ? '<:rep:741355268625006694> Reputation' : '<:rep:741355268625006694> Reputación', reputation.toLocaleString(), true)
		.addField(lang === 'en' ? ':heart: Married to' : ':heart: Casado con', marry.has(`${member.user.id}.tag`) ? await marry.get(`${member.user.id}.tag`) : lang === 'en' ? 'Nobody' : 'Nadie')
		.addField(lang === 'en' ? '<:trofeo:741356106353213560> Trophies' : '<:trofeo:741356106353213560>  Trofeos', trofeos.has(member.user.id) ? await trofeos.get(member.user.id) : lang === 'en' ? 'Nothing' : 'Ninguno')
		.setColor(member.displayHexColor)
		.setTimestamp()
		.setFooter('Sistema en beta');

	return message.channel.send(embed);
};
module.exports.help = {
	name: 'profile',
	description: 'Muestra tu logros a los demas!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};