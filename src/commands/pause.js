// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args) => {
	const serverQueue = client.queue.get(message.guild.id);

	if (!serverQueue) return message.channel.send(client.lang.music.noQueue);

	if (!message.member.voice.channel) return message.channel.send(client.lang.music.needJoin);

	if (serverQueue.connection.dispatcher.paused) {return message.channel.send(client.lang.commands.pause.alreadyPaused);}
	serverQueue.playing = false;
	serverQueue.connection.dispatcher.pause(true);

	return message.channel.send(client.lang.commands.pause.sucess);
};
module.exports.help = {
	name: 'pause',
	description: 'Vas al baño? pausa tu musica!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};