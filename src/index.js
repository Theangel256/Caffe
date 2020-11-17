require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
	client.functions = require('./structures/functions.js');
	client.database = require('./structures/DatabaseManager');
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.limits = new Map();
	client.queue = new Map();
	client.snipes = new Map();
	client.Discord = Discord;
	require('./structures/auto-updater');
	require('./structures/dashboard').run(client);
	require('./structures/command').run(client);
	require('./structures/event').run(client);
	client.login(process.env.TOKEN).then(() => console.log(`Estoy listo, soy ${client.user.tag}`))
	.catch((err) => console.error('Error al iniciar sesión: ' + err));
	process.on("unhandledRejection", (r) => {
		console.dir(r);
	});