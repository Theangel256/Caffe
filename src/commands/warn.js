const getMember = require('../structures/functions/getMember');
module.exports.run = async (client, message, args) => {
	const warns = new client.database('warns'),
		opciones = new client.database('opciones');
	const wUser = getMember(message, args, false);
	const mUser = message.author;
	if(!wUser) return message.channel.send('Menciona a un usuario `/warn @Theangel256#9808 spam`');
	let razon = args.slice(1).join(' ');
	if (!razon) razon = client.lang.no_reason;

	if(!warns.has(`${message.guild.id}.${wUser.user.id}.warns`)) {
		warns.set(`${message.guild.id}.${wUser.user.id}`, { warns: 0 });
	}
	warns.add(`${message.guild.id}.${wUser.user.id}`, { warns: 1 });
	if(!warns.has(`${message.guild.id}.${wUser.user.id}.reason`)) {
		warns.set(`${message.guild.id}.${wUser.user.id}`, { reason: [`${razon}`] });
	}
	else {
		warns.push(`${message.guild.id}.${wUser.user.id}`, { reason: [`${razon}`] });
	}
	const count = await warns.get(`${message.guild.id}.${wUser.user.id}.warns`);
	if(opciones.has(`${message.guild.id}.channels.logs`)) {
		const logchannel = await opciones.get(`${message.guild.id}.channels.logs`);
		const canal = client.channels.resolve(logchannel);
		const embed2 = new client.Discord.MessageEmbed()
			.setColor('RED')
			.setThumbnail(wUser.user.displayAvatarURL({ dynamic:true }))
			.setDescription('**Warn**')
			.addField('「:boy:」Usuario:', wUser)
			.addField('「:speech_balloon:」Razón:', razon)
			.addField('「:closed_book:」Cantidad de advertencias:', count)
			.addField('「:fleur_de_lis:️」 Moderador responsable:', mUser);
		canal.send(embed2);
	}
	const embed3 = new client.Discord.MessageEmbed()
		.setAuthor(wUser.user.tag + ' Ha sido advertido', wUser.user.displayAvatarURL({ dynamic:true }))
		.setDescription('**Razón**: ' + razon);
	message.channel.send(embed3);
	message.delete();
};
module.exports.help = {
	name: 'warn',
	description: 'Sanciona a un miembro mal portado :/',
};
module.exports.requirements = {
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: [],
	ownerOnly: false,
};