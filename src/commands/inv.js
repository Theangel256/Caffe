const economy = require('../structures/models/SystemEconomy');
module.exports.run = async (client, message) => {
let consulta = await economy.findOne({guildID: message.guild.id, userID: message.author.id})

let oro = ("No tienes ningun objeto en el inventario, ve a minar o explorar.")
if(consulta.oro) oro = (`\n**Oro:** ${consulta.oro}`)

let inventario = new client.Discord.MessageEmbed()
.setAuthor(`Inventario de ${message.author.username}`, message.author.displayAvatarURL())
.setDescription(oro)
message.channel.send(inventario);

}
module.exports.help = {
	name: 'inv',
	description: 've lo que te has ganado trabajando duro!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};