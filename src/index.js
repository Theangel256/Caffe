const Discord = require('discord.js');
const client = new Discord.Client();
	client.config = require('./config.js');
	client.functions = require('./structures/functions.js')
	//client.database = require('./structures/DatabaseManager');
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.limits = new Map();
	client.queue = new Map();
	client.snipes = new Map();
	client.Discord = Discord;
	require('./structures/auto-updater.js').run()
	require('./structures/command.js').run(client);
	require('./structures/event.js').run(client);
	require('./structures/dashboard.js').run(client)
client.login("NzM4MDU1OTU0MzQ3NTg5Njc0.XyGWKw.M91j9FCX8ebS7P_sGekCtJt8PJw")
	.then(() => console.log(`Estoy listo, soy ${client.user.tag}`))
	.catch((err) => console.error('Error al iniciar sesión: ' + err));