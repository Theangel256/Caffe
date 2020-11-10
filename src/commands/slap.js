const marsnpm = require('marsnpm');
const { getMember } = require('../structures/functions');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, false),
		url = await marsnpm.slap();
	if(!member) return message.channel.send(client.lang.no_user);
	const embed = new client.Discord.MessageEmbed();
	embed.setDescription(`${message.author.username} abofeteó a ${member.user.username}`);
	embed.setImage(url);

	message.channel.send(embed);
};
module.exports.help = {
	name: 'slap',
	description: 'abofetea a alguien',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};