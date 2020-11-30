const moment = require('moment');
require('moment-duration-format');
const {getMember} = require('../structures/functions.js');
module.exports.run = async (client, message, args) => {
	const economia = new client.database('economia'),
		cooldown = new client.database('cooldown');
	if(cooldown.has(`${message.author.id}.rep`)) {
		const tiempo = await cooldown.get(`${message.author.id}.rep`);
		const duracion = moment.duration(tiempo - Date.now()).format(' D [d], H [hrs], m [m], s [s]');
		if (Date.now() < tiempo) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
	}
	const member = getMember(message, args, false);
	if(!member) return message.channel.send(client.lang.no_user);
	if(!economia.has(`${member.user.id}.rep`)) economia.set(`${member.user.id}.rep`, 0);
	if(member.user.id === message.author.id) return message.channel.send('No puedes darte reputacion ati mismo');
	if(member.user.bot) return message.channel.send('No puedes darle reputacion a un bot');
	economia.add(`${member.user.id}.rep`, 1);
	message.channel.send(`<:rep:741355268625006694>Punto de reputacion agregado a: **${member.user.username}**`);
	cooldown.set(`${message.author.id}.rep`, Date.now() + 86400000);
};
module.exports.help = {
	name: 'reputation',
	aliases: ['rep'],
	description: 'Agregale reputacion a tu amigo!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};