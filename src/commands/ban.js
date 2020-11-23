const getMember = require('../structures/functions/getMember');
module.exports.run = (client, message, args) => {
	const member = getMember(message, args, false),
		lang = client.lang.commands.ban;
	let reason = args.slice(1).join(' ');

	if (!args[0]) return message.channel.send(lang.no_args);

	if (!member) return message.channel.send(lang.no_user);

	if (!reason) reason = client.lang.no_reason;

	if (member.user.id === message.author.id) return message.channel.send(lang.yourself);

	if (!member.bannable) return message.channel.send(lang.bannable);

	member.ban({ reason: reason });

	message.channel.send(lang.sucess.replace(/{user.tag}/gi, member.user.tag).replace(/{reason}/gi, reason));
};
module.exports.help = {
	name: 'ban',
	description: 'Banea a una persona con este comando',
};
module.exports.requirements = {
	userPerms: ['BAN_MEMBERS'],
	clientPerms: ['BAN_MEMBERS'],
	ownerOnly: false,
};