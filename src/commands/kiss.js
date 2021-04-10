const marsnpm = require('marsnpm');
const { getMember } = require('../structures/functions');
module.exports.run = async (client, message, args) => {
	const img = await marsnpm.kiss();

	const member = getMember(message, args, false);

	if(!member) return message.channel.send(client.lang.no_user);

	if (member.user.id === message.author.id) return message.channel.send(client.lang.commands.kiss.yourself);

	const embed = new client.Discord.MessageEmbed();
	embed.setDescription(client.lang.commands.kiss.sucess.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
	embed.setImage(img);

	message.channel.send(embed);
};
module.exports.help = {
	name: 'kiss',
	description: 'Expresa tu amor mencionando a un miembro :3',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};