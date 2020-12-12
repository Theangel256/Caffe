const moment = require('moment'); require('moment-duration-format');
const {levels, regExp, missingPerms } = require('../structures/functions');
const db = require('quick.db');
module.exports = async (client, message) => {
	if (message.channel.type === 'dm') return;
	if (!message.guild || message.author.bot) return;
	const guild = new db.table('guilds');
	client.prefix = guild.has(`${message.guild.id}.prefix`) ? await guild.fetch(`${message.guild.id}.prefix`) : process.env.prefix;
	const lang = guild.has(`${message.guild.id}.language`) ?  await guild.fetch(`${message.guild.id}.language`) : 'en';
	client.lang = require(`../structures/languages/${lang}.js`);
	if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
		const invite = await client.generateInvite({permissions: ['ADMINISTRATOR']});
		const embed = new client.Discord.MessageEmbed()
			.addField(':gear: | Prefix', '> `' + client.prefix + '`')
			.addField(':satellite: | `' + client.prefix + '`Help', client.lang.events.message.isMentioned.field1)
			.addField('❔ | ' + client.lang.events.message.isMentioned.field2,
				`>>> [${client.lang.events.message.isMentioned.invite}](${invite})\n[Discord](https://discord.caffe-bot.com)\n[Twitter](https://twitter.com/Theangel256)\n[Facebook](https://www.facebook.com/Theangel256YT)\n[MySpawn](https://www.spigotmc.org/resources/myspawn.64762/)`)
			.setFooter(client.lang.events.message.isMentioned.footer + require('../../package.json').version + "\nPowered By CentralHost.es", client.user.displayAvatarURL({ dynamic:true }))
			.setTimestamp().setColor(0x00ffff);
		message.channel.send(embed).then(e => e.delete({ timeout: 60000 })).catch(e => console.log(e.message));
	}
	regExp(client, message);

	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command) || client.aliases.get(command);

	if(!message.content.startsWith(client.prefix)) {
		await levels(message);
		return;
	}
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