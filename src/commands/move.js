// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args) => {
	const lang = client.lang.commands.move,
		serverQueue = client.queue.get(message.guild.id);

	if(!message.guild.member(client.user).voice.channel) return message.channel.send(lang.disconnected);

	if (!serverQueue) return message.channel.send(lang.noQueue);

	if(!message.member.voice.channel) return message.channel.send(client.lang.music.needJoin);

	if(message.member.voice.channel === message.guild.me.voice.channel) return message.channel.send(lang.already_connected);

	if(message.member.voice.channel !== message.guild.me.voice.channel) message.member.voice.channel.join();

	message.channel.send(`${lang.sucess} **${message.member.voice.channel.name}**`);
};
module.exports.help = {
	name: 'move',
	description: 'Mueveme de canal cuando este reproduciendo musica',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['CONNECT'],
	ownerOnly: false,
};