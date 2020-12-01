const { readdirSync } = require('fs');
const { join } = require('path');
const filePath = join(__dirname, '..', 'events');
const eventFiles = readdirSync(filePath);
const moment = require('moment'); require('moment-duration-format');
module.exports.run = async (client, message) => {
	const actividad = moment.duration(client.uptime).format(' D [d], H [hrs], m [m], s [s]'),
		servers = client.guilds.cache.size,
		lang = client.lang.commands.stats,
		users = client.users.cache.size,
		canales = client.channels.cache.size,
		voz = client.voice.connections.size,
		emojis = client.emojis.cache.size,
		modulos = require('../../package.json'),
		cpu = `${Math.round(process.cpuUsage().user / 1024 / 1024)}%`,
		memory = `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024).toString().slice(0, 6))} MB`,
		invite = await client.generateInvite(['ADMINISTRATOR']),
		main = new client.Discord.MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic:true })).setColor(0x00ffff).setTimestamp()
			.addField('⁉️ ' + lang.statistics, `>>> **Theangel256 Studios** ${lang.owner}\n**${servers.toLocaleString()}** ${lang.guilds}\n**${users.toLocaleString()}** ${lang.users}\n**${canales.toLocaleString()}** ${lang.channels}\n**${emojis.toLocaleString()}** Emojis\n**${client.commands.size.toLocaleString()}** ${lang.commands}\n**${eventFiles.length.toLocaleString()}** ${lang.events}\n**${actividad}** ${lang.uptime}\n**${Math.round(message.client.ws.ping)}ms** Ping\n**${voz}** ${lang.connections.toLocaleString()}\n**${modulos.version}** ${lang.version}\n**${client.Discord.version}** Discord.JS\n**${client.prefix}** Prefix\n**${memory}** ${lang.usage}\n**${cpu}** CPU\n**${modulos.engines.node}** Node`, true)
			.addField('❔ LINKS', `>>> [Invite](${invite})\n[Discord](https://discord.Caffe-bot.com)\n[Twitter](https://twitter.com/Theangel256)\n[Facebook](https://www.facebook.com/Theangel256YT)\n[MySpawn](https://www.spigotmc.org/resources/myspawn.64762/)`, true)
			.setFooter(client.lang.events.message.isMentioned.footer + modulos.version, client.user.displayAvatarURL());
	message.channel.send(main);
};
module.exports.help = {
	name: 'stats',
	aliases: ['botinfo', 'info','bot', 'botstats'],
	description: 've mi estadisticas para estar al tanto de mi cuidado <3',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};