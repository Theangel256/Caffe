/*
const db = require('quick.db');
module.exports.run = async (client, message) => {
	const economy = new db.table('economy');
let consulta = await economy.fetch(`${message.author.id}`);
if(!consulta) {
	await economy.set(`${message.author.id}.money`, 200)
	await economy.set(`${message.author.id}.oro`, 2)
}
economy.add(`${message.author.id}.money`, 50)
economy.add(`${message.author.id}.oro`, 2)
const embed = new EmbedBuilder()
.setAuthor('Mina Rueca', message.author.displayAvatarURL({format:'jpg', dynamic:true}))
.setDescription(`**${message.author.username}** has minado en la **Mina Rueca** y has obtenido:\n**Dinero:** 50\n**Oro:** 2`)
.setColor(message.guild.me.displayHexColor);
message.channel.send({ embeds: [embed] });

}
*/
module.exports.help = {
  name: "mine",
  description: "trabaja duro para conseguir dinero!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["EMBED_LINKS"],
  ownerOnly: false,
};
module.exports.limits = {
  rateLimit: 1,
  cooldown: 300000,
};
