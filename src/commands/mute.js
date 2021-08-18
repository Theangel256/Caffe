/*
const db = require('quick.db');
const {getMember} = require('../functions.js');
const ms = require('ms');
module.exports.run = async (client, message, args) => {
	const MuteDB = new db.table('systemMute');
	const guilds = new db.table('guilds');
	const lang = client.lang.commands.mute;
		let tomute = getMember(message, args.slice(0, 1), false);
	if(!tomute) return message.channel.send(lang.no_user);
	let data = MuteDB.has(`${message.guild.id}.${tomute.author.id}`)
    if (data) return message.channel.send("Usuario ya está Muteado");
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

	if(guilds.has(`${message.guild.id}.channels.logs`)) {
		const logchannel = guilds.fetch(`${message.guild.id}.channels.logs`);
		const incidentschannel = message.guild.channels.resolve(logchannel);
		if(!incidentschannel) return;
		incidentschannel.send(muteembed);
	}
	tomute.roles.add(rolMute);
	message.channel.send(lang.sucess.replace(/{user.tag}/gi, tomute.user.tag).replace(/{reason}/gi, reason).replace(/{by}/gi, args[1]));
	MuteDB.set(`${message.guild.id}.${message.author.id}`, { rolID: rolMute, time: Date.now() + mutetime })
	};
	*/
module.exports.help = {
  name: "mute",
  description: "Silencia a un miembro del servidor",
};
module.exports.requirements = {
  userPerms: ["MANAGE_MESSAGES"],
  clientPerms: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
  ownerOnly: false,
};
