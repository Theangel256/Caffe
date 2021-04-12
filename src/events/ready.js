const warns = require('../structures/models/warns');
// const {  Landiacraft } = require('../structures/functions');
module.exports = async (client) => {
	setInterval(async function() {
		const allData = await warns.find();
		allData.map(async a => {
			if (a.time < Date.now()) {
				const member = client.guilds.resolve(a.guildID).member(a.userID);
				member.roles.remove(a.rolID);
				await warns.deleteOne({ userID: a.userID });
			}
		});
	}, 10000);
	const statues = [`$help | ${client.users.cache.size.toLocaleString()} users!`,
		'Theangel256 Studios V' + require('../../package.json').version,
		'caffe-bot.sirnice.xyz/discord', 'caffe-bot.sirnice.xyz/add'];
	setInterval(function() {
		const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
		client.user.setPresence({ activity: { name: status }, status: 'online' });
	}, 20000);
	// Landiacraft(client);
};