const db = require('quick.db');
const {getMember} = require('../structures/functions');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true);
	const consulta = db.get(`${message.author.id}`)
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