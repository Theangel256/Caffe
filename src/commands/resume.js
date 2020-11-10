// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args) => {
	const fetched = client.queue.get(message.guild.id);

	if (!fetched) return message.channel.send(client.lang.music.noQueue);

	if (!message.member.voice.channel) return message.channel.send(client.lang.music.needJoin);

	if (!fetched.connection.dispatcher.paused) return message.channel.send('La musica no esta pausada');

	fetched.playing = true;
	await fetched.connection.dispatcher.resume();

	message.channel.send('Canción actual reanudada.');
};
module.exports.help = {
	name: 'resume',
	description: 'Ya viniste del baño? resume tu lista de canciones',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};