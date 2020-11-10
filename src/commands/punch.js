const marsnpm = require('marsnpm');
const { getMember } = require('../structures/functions');

module.exports.run = async (client, message, args) => {
	const img = await marsnpm.punch(),
		lang = client.lang.commands.punch,
		member = getMember(message, args, false);

	if(!member) return message.channel.send(client.lang.no_user);

	const embed = new client.Discord.MessageEmbed();
	embed.setDescription(message.author.id === member.user.id
		? lang.no_user.replace(/{user.username}/gi, member.user.username)
		: lang.user.replace(/{author.username}/gi, message.author.username).replace(/{user.username}/gi, member.user.username));
	embed.setImage(img);

	message.channel.send(embed);
};
module.exports.help = {
	name: 'punch',
	description: 'Expresa tu odio golpeando a otro usuario con una mencion!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};