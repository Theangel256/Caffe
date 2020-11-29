const economy = require('../structures/models/SystemEconomy');
const getMember = require('../structures/functions/getMember');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true);
	const consulta = await economy.findOne({guildID: message.guild.id, userID: member.id})
	const lang = client.lang.commands.balance;
	let balance = new client.Discord.MessageEmbed()
	.setAuthor(lang.replace("/{user.username}/gi", member.user.username))
	.setThumbnail(member.displayAvatarURL({format:"jpg", dyanmic: true}))
	.addField(`Dinero`, consulta.money, true)
	.addField(`Banco`, consulta.banco, true)
	message.channel.send(balance)
};
module.exports.help = {
	name: 'balance',
	aliases: ['bal', 'money'],
	description: 'Muestra el dinero que tienes en el bot',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};