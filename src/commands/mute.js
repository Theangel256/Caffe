const getMember = require('../structures/functions/getMember');
const MuteDB = require('../structures/models/SystemMute');
const ms = require('ms');
module.exports.run = async (client, message, args) => {
	const opciones = new client.database('opciones'),
		lang = client.lang.commands.mute;
		let tomute = getMember(message, args.slice(0, 1), false);
	if(!tomute) return message.channel.send(lang.no_user);
	let data = await MuteDB.findOne({ userID: tomute.user.id })
    if (data) return message.channel.send("Usuario ya está Muteado")
	if(tomute.user.id == client.user.id || (tomute.user.id == message.author.id)) return message.channel.send(lang.himself);
	let rolMute;
    if (message.guild.roles.cache.find(x => x.name == "Muted")) {
        rolMute = message.guild.roles.cache.find(x => x.name == "Muted").id
    } else {
        let a = await message.guild.roles.create({
            data: { name: 'Muted', color: '#7E7E7E' }
        })
        rolMute = a.id
	}
	message.guild.channels.cache.forEach(async (channel) => {
        await channel.updateOverwrite(rolMute, {
            SEND_MESSAGES: false,
        });
    });
	if(!args[1]) return message.channel.send(lang.no_time);
	const mutetime = ms(args[1]);
	if(!mutetime) return message.channel.send(lang.invalid_format);
	let reason = args.slice(2).join(' ');
	if (!reason) reason = client.lang.no_reason;

	if(tomute.roles.highest.comparePositionTo(message.guild.me.roles.highest) > 0) return message.channel.send(lang.highest);

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
	tomute.roles.add(rolMute)
	message.channel.send(lang.sucess.replace(/{user.tag}/gi, tomute.user.tag).replace(/{reason}/gi, reason).replace(/{by}/gi, args[1]));
    let wc = new MuteDB({ guildID: message.guild.id, userID: tomute.user.id, rolID: rolMute, time: Date.now() + mutetime })
    await wc.save();
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