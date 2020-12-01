const db = require('quick.db')
module.exports.run = (client, message) => {
	const economy = new db.table('economy');
let consulta = economy.get(`${message.author.id}`);
if(!consulta) economy.set(`${message.author.id}`, { money: 200, oro: 2 })

economy.add(`${message.author.id}.money`, 50) 
economy.add(`${message.author.id}.oro`, 2)
let embed = new client.Discord.MessageEmbed()
.setAuthor(`Mina Rueca`, message.author.displayAvatarURL())
.setDescripcion(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50\n**Oro:** 2`);
message.channel.send(embed);

}
module.exports.help = {
	name: 'mine',
	description: 'trabaja duro para conseguir dinero!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};
module.exports.limits = {
	rateLimit: 1,
	cooldown: 300000,
};