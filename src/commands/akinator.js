/* eslint-disable no-unused-vars */
const mech_aki = require('mech-aki');
module.exports.run = async (client, message) => {
	const embed = new client.Discord.MessageEmbed()
		.setColor('RANDOM');
	const akinator = new mech_aki('es');
	let pregunta = await akinator.empezar();
	embed.setTitle(pregunta.pregunta);
	const respuestas = new Map([
		['✅', 0], ['❌', 1], ['❓', 2], ['🤔', 3], ['😞', 4], ['🔙', -9],
	]);
	const array_respuestas = ['✅', '❌', '❓', '🤔', '😞', '🔙'];
	embed.addField('Opciones',
		'✅: Sí\n❌: No\n❓: No lo sé\n🤔: Probablemente sí\n😞: Probablemente no\n🔙: Atrás', false);
	const msg = await message.reply(embed);
	for (let index = 0; index < array_respuestas.length; index++) {await msg.react(array_respuestas[index]);}
	while (akinator.progreso < 85) {
		const respuesta = await new Promise((resolve, reject) => {
			const collector = msg.createReactionCollector((reaction, user) => !user.bot && user.id === message.author.id &&
            reaction.message.channel.id === msg.channel.id, { time: 60000 });
			collector.on('collect', r => {
				resolve(r.emoji.name);
				collector.stop();
			});
			collector.on('end', () => resolve(null));
		});
		if (!respuesta) return msg.delete();
		const respuesta_num = respuestas.get(respuesta);
		pregunta = respuesta_num != -9
			? await akinator.siguiente(respuesta_num)
			: await akinator.atras();
		embed.setTitle(pregunta.pregunta);
		await msg.edit(embed);
	}

	const personajes = await akinator.respuestas();
	embed.setTitle('✅Tu personaje es: ' + personajes[0].nombre);
	embed.setDescription(personajes[0].descripcion);
	embed.setImage(personajes[0].foto);
	embed.fields = [];
	msg.delete();
	message.reply(embed);
};
module.exports.help = {
	name: 'akinator',
	aliases: ['aki'],
	description: 'Deja que Akinator descubra lo que hay en tu mente',
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