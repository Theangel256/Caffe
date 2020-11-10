const marsnpm = require('marsnpm');
const { getMember } = require('../structures/functions');
module.exports.run = async (client, message, args) => {
	const img = await marsnpm.kill(),
		member = getMember(message, args, false);
	if(!member) return message.channel.send(client.lang.no_user);

	const embed = new client.Discord.MessageEmbed()
		.setDescription(message.author.id === member.user.id
			? client.lang.commands.kill.himself.replace(/{user.username}/gi, member.user.username)
			: client.lang.commands.kill.another_person.replace(/{author.username}/gi, message.author.username).replace(/{user.username}/gi, member.user.username))
		.setImage(img);
	message.channel.send(embed);
};
module.exports.help = {
	name: 'kill',
	description: 'Expresa tu deseo de matar a alguien >:}',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};