// const { muteSystem, Landiacraft } = require('../structures/functions');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data.sqlite');
module.exports = async (client) => {
	db.run('CREATE TABLE IF NOT EXISTS levelSystem (idguild TEXT, idusuario TEXT, lvl INTEGER, exp INTEGER)', function(err) {
		if (err) return console.error('Ready.js file\n' + err.message);
	});
	db.run('CREATE TABLE IF NOT EXISTS guilds (idguild TEXT, prefix TEXT, language TEXT)', function(err) {
		if (err) return console.error('Ready.js file\n' + err.message);
	});
	/* setInterval(() => {
		muteSystem(client)
	}, 10000); */
	const statues = [`/help | ${client.users.cache.size.toLocaleString()} users!`,
		'Theangel256 Studios V' + require('../../package.json').version, 'discord.caffe-bot.com', 'add.caffe-bot.com'];
	setInterval(function() {
		const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
		client.user.setPresence({ activity: { name: status }, status: 'online' });
	}, 20000);
	// Landiacraft(client);
};