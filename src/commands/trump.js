const marsnpm = require('marsnpm');
module.exports.run = async (client, message, args) => {
	if(!args.join(' ')) return message.channel.send('Escribe algo');
	const img = await marsnpm.trump(args.join(' '));
	message.channel.send({ files: [img] });
};
module.exports.help = {
	name: 'trump',
	aliases: [],
	description: 'nueva regla de trump!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};