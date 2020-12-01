const db = require('quick.db');
const {getRank} = require('../structures/functions');
module.exports.run = (client, message, args) => {
	const levels = new db.table('levels');
	let niveles = levels.fetch(`${message.guild.id}.${message.author.id}`);
	if(!niveles) {
		levels.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 1 });
		niveles = levels.fetch(`${message.guild.id}.${message.author.id}`);
	}
	const usuarios = getRank(levels.fetch(message.guild.id), message);
	usuarios.map((usuario, index) => usuarios[index] = `> #${index + 1} ${usuario[0]} | LVL: ${usuario[1]} | XP: ${usuario[2]}/${usuario[1] * 80}`);
	const paginas = [];
	const cantidad = 15;
	while(usuarios.length > 0) {
		paginas.push(usuarios.splice(0, cantidad));
	}
	const embed = new client.Discord.MessageEmbed()
		.setColor('RANDOM')
		.setThumbnail(message.guild.iconURL({ dynamic:true }));
	if(!args[0]) {
		embed.setDescription(`Ranklist del servidor ${message.guild.name} (pagina 1 de ${paginas.length})\n\n${paginas[0].join('\n')}`);
		return message.channel.send(embed);
	}
	if(isNaN(args[0])) return message.channel.send('Necesitas ingresar el numero de la pagina');
	const seleccion = parseInt(args[0]);
	if(seleccion <= 0 || seleccion > paginas.length) return message.channel.send(`La pagina ${seleccion} no existe.`);
	embed.setDescription(`Ranklist del servidor ${message.guild.name} (pagina ${seleccion} de ${paginas.length})\n\n${paginas[seleccion - 1].join('\n')}`);
	return message.channel.send(embed);
};
module.exports.help = {
	name: 'ranklist',
	aliases: ['leaderboard'],
	description: 'Muestra la lista de niveles de todo el servidor!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};