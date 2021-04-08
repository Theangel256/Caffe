const { muteSystem, Landiacraft } = require('../structures/functions')
module.exports = async (client) => {
	/*setInterval(() => {
		muteSystem(client)
	}, 10000);*/
	const statues = [`/help | ${client.users.cache.size.toLocaleString()} users!`,
		'Theangel256 Studios V' + require('../../package.json').version, 'discord.caffe-bot.com', 'add.caffe-bot.com'];
	setInterval(function() {
		const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
		client.user.setPresence({ activity: { name: status }, status: 'online' });
	}, 20000);
	//Landiacraft(client);
	}