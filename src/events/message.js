const { RegExpFunc, nivelesFunc, missingPerms } = require('../structures/functions.js'),
	moment = require('moment'); require('moment-duration-format');
module.exports = async (client, message) => {
	const opciones = new client.database('opciones');
	if (message.channel.type === 'dm') return;
	if (!message.guild || message.author.bot) return;
	const prefix = opciones.has(`${message.guild.id}.prefix`) ? await opciones.get(`${message.guild.id}.prefix`) : process.env.prefix;
	const langcode = opciones.has(`${message.guild.id}.language`) ? await opciones.get(`${message.guild.id}.language`) : 'en';
	const lang = require(`../structures/languages/${langcode}.js`);
	client.prefix = prefix;
	client.lang = lang;
	if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
		const invite = await client.generateInvite(['ADMINISTRATOR']);
		const embed = new client.Discord.MessageEmbed()
			.addField(':gear: | Prefix', '> `' + prefix + '`')
			.addField(':satellite: | `' + prefix + '`Help', lang.events.message.isMentioned.field1)
			.addField('❔ | ' + lang.events.message.isMentioned.field2,
				`>>> [${lang.events.message.isMentioned.invite}](${invite})\n[Discord](https://discord.Caffe-bot.com)\n[Twitter](https://twitter.com/Theangel256)\n[Facebook](https://www.facebook.com/Theangel256YT)\n[MySpawn](https://www.spigotmc.org/resources/myspawn.64762/)`)
			.setFooter(lang.events.message.isMentioned.footer + require('../../package.json').version, client.user.displayAvatarURL({ dynamic:true }))
			.setTimestamp().setColor(0x00ffff);
		message.channel.send(embed).then(e => e.delete({ timeout: 60000 })).catch(e => console.log(e.message));
	}
	RegExpFunc(client, message);

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command) || client.aliases.get(command);

	if(!message.content.startsWith(prefix)) {
		nivelesFunc(message);
		return;
	}
	if(!cmd) return;
	if(!message.guild.me.hasPermission('SEND_MESSAGES')) return;

	if(cmd.requirements.ownerOnly && !process.env.owners.includes(message.author.id)) {return message.reply(lang.only_developers);}

	if(cmd.requirements.userPerms && !message.member.hasPermission(cmd.requirements.userPerms)) {return message.reply(lang.userPerms.replace(/{function}/gi, missingPerms(client, message.member, cmd.requirements.userPerms)));}

	if(cmd.requirements.clientPerms && !message.guild.me.hasPermission(cmd.requirements.clientPerms)) return message.reply(lang.clientPerms.replace(/{function}/gi, missingPerms(client, message.guild.me, cmd.requirements.clientPerms)));

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