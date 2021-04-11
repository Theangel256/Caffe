const moment = require('moment'); require('moment-duration-format');
const { levels, missingPerms } = require('../structures/functions');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data.sqlite');
module.exports = async (client, message) => {
	if (message.channel.type === 'dm') return;
	if (!message.guild) return;
	if(message.author.bot) return;
	db.get('SELECT * FROM guilds WHERE idguild = ?', (message.guild.id), (err, filas) => {
		if (err) return console.error(err.message);
		if(!filas) {
			db.run('INSERT INTO guilds(idguild, prefix, language) VALUES($idguild, $prefix, $language)', { $idguild: message.guild.id, $prefix: process.env.prefix, $languague: 'en' }, function(err) {
				if (err) return console.error(err.message);
			});
		}
		client.prefix = filas.prefix;
		client.lang = require(`../structures/languages/${filas.language}.js`);
	});
	if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
		const invite = await client.generateInvite({ permissions: ['ADMINISTRATOR'] });
		const embed = new client.Discord.MessageEmbed()
			.addField(':gear: | Prefix', `> \`${client.prefix}\``)
			.addField(`:satellite: | \`${client.prefix}\`Help`, client.lang.events.message.isMentioned.field1)
			.addField(`❔ | ${client.lang.events.message.isMentioned.field2}`, `>>> [${client.lang.events.message.isMentioned.invite}](${invite})\n[Discord](https://caffe-bot.sirnice.xyz/discord)\n[Twitter](https://twitter.com/Theangel256)`)
			.setFooter(client.lang.events.message.isMentioned.footer + require('../../package.json').version, client.user.displayAvatarURL({ format: 'jpg', dynamic:true }))
			.setTimestamp()
			.setColor(0x00ffff);
		message.channel.send(embed).then(e => e.delete({ timeout: 120000 })).catch(e => console.log(e.message));
	}
	if(!message.content.startsWith(client.prefix)) {
		levels(message);
		return;
	}
	// regExp(client, message);

	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command) || client.aliases.get(command);

	if(!cmd) return;
	if(!message.guild.me.hasPermission('SEND_MESSAGES')) return;

	if(cmd.requirements.ownerOnly && !process.env.owners.includes(message.author.id)) return message.reply(client.lang.only_developers);

	if(cmd.requirements.userPerms && !message.member.hasPermission(cmd.requirements.userPerms)) return message.reply(client.lang.userPerms.replace(/{function}/gi, missingPerms(client, message.member, cmd.requirements.userPerms)));

	if(cmd.requirements.clientPerms && !message.guild.me.hasPermission(cmd.requirements.clientPerms)) return message.reply(client.lang.clientPerms.replace(/{function}/gi, missingPerms(client, message.guild.me, cmd.requirements.clientPerms)));

	if(cmd.limits) {
		const current = client.limits.get(`${command}-${message.author.id}`);

		if(!current) {client.limits.set(`${command}-${message.author.id}`, 1);}
		else {
			const duracion = moment.duration(cmd.limits.cooldown).format(' D [d], H [hrs], m [m], s [s]');
			if(current >= cmd.limits.rateLimit) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
			client.limits.set(`${command}-${message.author.id}`, current + 1);
		}
		setTimeout(() => {
			client.limits.delete(`${command}-${message.author.id}`);
		}, cmd.limits.cooldown);
	}

	cmd.run(client, message, args);
};