const marsnpm = require('marsnpm');
const getMember = require('../structures/functions/getMember');

module.exports.run = async (client, message, args) => {
	const img = await marsnpm.hug(),
		member = getMember(message, args, false);
	if(!member) return message.channel.send(client.lang.no_user);
	const embed = new client.Discord.MessageEmbed();
	embed.setDescription(message.author.id === member.Discorduser.id
		? client.lang.commands.hug.himself.replace(/{user.username}/gi, member.user.username)
		: client.lang.commands.hug.another_person.replace(/{author.username}/gi, message.author.username).replace(/{user.username}/gi, member.user.username));
	embed.setImage(img);
	message.channel.send(embed);
};
module.exports.help = {
	name: 'hug',
	description: 'Menciona a un miembro para demostrar tu afecto con un abrazo!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};