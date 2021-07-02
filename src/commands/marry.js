/*
const db = require('quick.db');
const {getMember} = require('../structures/functions.js');
module.exports.run = async (client, message, args) => {
	const marrys = new db.table('marrys');
	const lang = client.lang.commands.marry;
	const member = getMember(message, args, false);
	if(marrys.has(message.author.id)) return message.channel.send(lang.married.replace(/{esposaTag}/gi, await marrys.fetch(`${message.author.id}.tag`)));
	if(!member) return message.channel.send(client.lang.no_user);
	if(member.user.bot) return message.channel.send(lang.bot);
	if(member.user.id === message.author.id) return message.channel.send(lang.yourself);
	if(marrys.has(`${member.user.id}.id`)) return message.channel.send(lang.another_married);
	message.channel.send(lang.request.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
	const filter = m => m.author.id === member.user.id && (m.content && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')));
	message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] }).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			marrys.set(`${member.user.id}`, { id: message.author.id });
			marrys.set(`${message.author.id}`, { id: member.user.id});
			marrys.set(`${member.user.id}`, { tag: message.author.tag });
			marrys.set(`${message.author.id}`, { tag: member.user.tag });
			return message.channel.send(lang.sucess.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
		}
		else if (collected.first().content.toLowerCase() === 'no') {
			return message.channel.send(lang.unsucess.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
		}
	}).catch(() => message.channel.send(client.lang.commands.marry.expired.replace(/{user.username}/gi, member.user.username)));
};
*/
module.exports.help = {
  name: "marry",
  description: "Podras casarte con un miembro con este comando",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
module.exports.limits = {
  rateLimit: 1,
  cooldown: 120000,
};
