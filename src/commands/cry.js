const marsnpm = require('marsnpm');
const getMember  = require('../structures/functions/getMember');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true),
		lang = client.lang.commands.cry,
		url = await marsnpm.cry(),
		embed = new client.Discord.MessageEmbed();
	embed.setDescription(message.author.id === member.user.id
		? lang.no_user.replace(/{user.username}/gi, member.user.username)
		: lang.user.replace(/{author.username}/gi, message.author.username).replace(/{user.username}/gi, member.user.username));
	embed.setImage(url);

	message.channel.send(embed);
};
module.exports.help = {
	name: 'cry',
	description: 'Expresa tu tristesa con este comando',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};