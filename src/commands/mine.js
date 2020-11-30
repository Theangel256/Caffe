const { getData } = require('../structures/functions/databaseManager.js');
const economy = require(__dirname + '/structures/models/systemEconomy.js');
module.exports.run = async(client, message) => {
let consulta = await getData({ guildID: message.guild.id, userID: message.author.id}, "systemEconomy");
let embed = new client.Discord.MessageEmbed()
if(!consulta){
await economy.insertOne({
	guildID: message.guild.id,
	userID: message.author.id,
	money: 50,
	oro: 2
})
embed.setAuthor(`Mina Rueca`, message.author.displayAvatarURL())
.setDescripcion(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50\n**Oro:** 2`);
message.channel.send(embed);

}else {

await economy.updateOne({ guildID: message.guild.id, userID: message.author.id}, {$inc: {money: 50, oro: 2}}) 

embed.setAuthor(`Mina Rueca`, message.author.displayAvatarURL())
.setDescripcion(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50\n**Oro:** 2`);
message.channel.send(embed);

}
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