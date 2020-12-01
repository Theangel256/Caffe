const {getMember} = require('../structures/functions');

module.exports.run = (client, message, args) => {
	const member = getMember(message, args, true),
		lang = client.lang.commands.avatar,
		embed = new client.Discord.MessageEmbed()
			.setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
			.setColor(member.displayHexColor)
			.setFooter(message.author.id === member.user.id
				? lang.no_user.replace(/{user.username}/gi, member.user.username)
				: lang.user.replace(/{user.username}/gi, member.user.username));
	message.channel.send(embed);
};
module.exports.help = {
	name: 'avatar',
	description: 'Muestra el avatar que tienes actualmente',
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