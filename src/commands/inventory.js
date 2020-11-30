const {getData} = require('../structures/functions/databaseManager');
const getMember = require('../structures/functions/getMember')
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true);
	const consulta = await getData({guildID: message.guild.id, userID: member.user.id}, 'SystemEconomy')
	const lang = client.lang.commands.inv;
	let oro = (lang.oro)
if(consulta.oro) oro = (`\n**Oro:** ${consulta.oro}`)

let inventario = new client.Discord.MessageEmbed()
.setAuthor(lang.inv.replace("/{user.username}/gi", member.user.username), message.author.displayAvatarURL())
.setDescription(oro)
message.channel.send(inventario);

}
module.exports.help = {
	name: 'inventory',
	aliases: ["inv"],
	description: 've lo que te has ganado trabajando duro!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};