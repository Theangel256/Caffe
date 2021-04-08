/*
const moment = require('moment');
require('moment-duration-format');
const {getMember} = require('../structures/functions.js');
const db = require('quick.db');
module.exports.run = async (client, message, args) => {
	const economy = new db.table('economy');
	if(economy.has(`${message.author.id}.repCooldown`)) {
		const tiempo = economy.get(`${message.author.id}.repCooldown`);
		const duracion = moment.duration(tiempo - Date.now()).format(' D [d], H [hrs], m [m], s [s]');
		if (Date.now() < tiempo) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
	}
	const member = getMember(message, args, false);
	if(!member) return message.channel.send(client.lang.no_user);
	if(member.user.id === message.author.id) return message.channel.send('No puedes darte reputacion ati mismo');
	if(member.user.bot) return message.channel.send('No puedes darle reputacion a un bot');
	economy.add(`${member.user.id}.rep`, 1);
	message.channel.send(`<:rep:741355268625006694>Punto de reputacion agregado a: **${member.user.username}**`);
	economy.set(`${message.author.id}`, { repCooldown: Date.now() + 86400000 });
};
*/
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