const marsnpm = require('marsnpm');
const {getMember} = require('../structures/functions.js');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true),
		lang = client.lang.commands.angry,
		url = await marsnpm.angry(),
		embed = new client.Discord.MessageEmbed()
			.setDescription(message.author.id === member.user.id
				? lang.no_user.replace(/{user.username}/gi, member.user.username)
				: lang.user.replace(/{author.username}/gi, message.author.username).replace(/{user.username}/gi, member.user.username))
			.setImage(url);
	message.channel.send(embed);
};
module.exports.help = {
	name: 'angry',
	description: 'Expresa tu enojo con este simple comando',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 3,
	cooldown: 20000,
};