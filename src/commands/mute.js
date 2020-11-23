const getMember = require('../structures/functions/getMember');
const ms = require('ms');
module.exports.run = async (client, message, args) => {
	const opciones = new client.database('opciones'),
		cooldown = new client.database('cooldownmute'),
		lang = client.lang.commands.mute;
		let tomute = getMember(message, args.slice(0, 1), false);
	if(!tomute) return message.channel.send(lang.no_user);
	if(tomute.user.id == client.user.id || (tomute.user.id == message.author.id)) return message.channel.send(lang.himself);
	let muterole = message.guild.roles.cache.find(r => r.name === 'Muted');
	if(!muterole) {
		try{
			muterole = await message.guild.roles.create({
				data: {
					name: 'Muted',
					color: '#7E7E7E'
				}});
			message.guild.channels.cache.each(async channel => await channel.updateOverwrite(muterole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			}));
		} catch(e) {
			console.log(e.message);
		}
	}
	if(!args[1]) return message.channel.send(lang.no_time);
	const mutetime = ms(args[1]);
	if(!mutetime) return message.channel.send(lang.invalid_format);
	let reason = args.slice(2).join(' ');
	if (!reason) reason = client.lang.no_reason;
	if(cooldown.has(`${message.guild.id}.${tomute.user.id}`)) {return message.channel.send(lang.already_muted);}

	if(tomute.roles.highest.comparePositionTo(message.guild.me.roles.highest) > 0) {return message.channel.send(lang.highest);}

	const muteembed = new client.Discord.MessageEmbed()
		.setDescription(`${lang.muteembed.description} ${message.author}`)
		.setColor('ORANGE')
		.addField(lang.muteembed.user, tomute)
		.addField(lang.muteembed.in, message.channel, true)
		.addField(lang.muteembed.date, message.createdAt.toDateString(), true)
		.addField(lang.muteembed.by, args[1], true)
		.addField(lang.muteembed.reason, reason, true);

	if(opciones.has(`${message.guild.id}.channels.logs`)) {
		const logchannel = await opciones.get(`${message.guild.id}.channels.logs`);
		const incidentschannel = message.guild.channels.resolve(logchannel);
		if(!incidentschannel) return;
		incidentschannel.send(muteembed);
	}
	tomute.roles.add(muterole.id).catch(err => console.log(`${err.message} ${tomute.id} ${message.guild.id}`));
	cooldown.set(`${message.guild.id}.${tomute.user.id}`, Date.now() + mutetime);
	message.channel.send(lang.sucess.replace(/{user.tag}/gi, tomute.user.tag).replace(/{reason}/gi, reason).replace(/{by}/gi, args[1]));
};
module.exports.help = {
	name: 'mute',
	description: 'Silencia a un miembro del servidor',
};
module.exports.requirements = {
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
	ownerOnly: false,
};