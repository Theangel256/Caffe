const moment = require('moment'); require('moment-duration-format');
// Databases
const prefixDB = require('../structures/models/prefix');
const langDB = require('../structures/models/lang');
// Functions
const missingPerms = require('../structures/functions/missingPerms')
const RegExpFunc = require('../structures/functions/regExp');
const nivelesFunc = require('../structures/functions/niveles');
const get = require('../structures/functions/get');
module.exports = async (client, message) => {
	if (message.channel.type === 'dm') return;
	if (!message.guild || message.author.bot) return;
	const prefix = await get(prefixDB, message.guild);
	const langcode = await get(langDB, message.guild);
	const lang = require(`../structures/languages/${langcode.language}.js`);
	console.log(lang)
	client.prefix = prefix.prefix;
	client.lang = lang;
	if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
		const invite = await client.generateInvite({permissions: ['ADMINISTRATOR']})
		const embed = new client.Discord.MessageEmbed()
			.addField(':gear: | Prefix', '> `' + client.prefix + '`')
			.addField(':satellite: | `' + client.prefix + '`Help', lang.events.message.isMentioned.field1)
			.addField('❔ | ' + lang.events.message.isMentioned.field2,
				`>>> [${lang.events.message.isMentioned.invite}](${invite})\n[Discord](https://discord.caffe-bot.com)\n[Twitter](https://twitter.com/Theangel256)\n[Facebook](https://www.facebook.com/Theangel256YT)\n[MySpawn](https://www.spigotmc.org/resources/myspawn.64762/)`)
			.setFooter(lang.events.message.isMentioned.footer + require('../../package.json').version, client.user.displayAvatarURL({ dynamic:true }))
			.setTimestamp().setColor(0x00ffff);
		message.channel.send(embed).then(e => e.delete({ timeout: 60000 })).catch(e => console.log(e.message));
	}
	RegExpFunc(client, message);

	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command) || client.aliases.get(command);

	if(!message.content.startsWith(client.prefix)) {
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