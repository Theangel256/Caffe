const moment = require('moment'); require('moment-duration-format');
const { levels, missingPerms, regExp } = require('../structures/functions');
const guilds = require('../structures/models/guilds');
module.exports = async (client, message) => {
	if (message.channel.type === 'dm') return;
	if (!message.guild) return;
	if(message.author.bot) return;
	const msgDocument = await guilds.findOne({
		guildID: message.guild.id,
	}).catch(err => console.log(err));
	if (!msgDocument) {
		try {
			const dbMsg = await new guilds({ guildID:  message.guild.id, prefix: process.env.prefix, language: 'en', role: false, kick: false, ban: false });
			var dbMsgModel = await dbMsg.save();
		}
		catch (err) {
			console.log(err);
		}
	}
	else {
		dbMsgModel = msgDocument;
	}
	const { prefix, language } = dbMsgModel;
	client.prefix = prefix;
	client.lang = require(`../structures/languages/${language}.js`);
	if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
		const invite = await client.generateInvite({ permissions: ['ADMINISTRATOR'] });
		const embed = new client.Discord.MessageEmbed()
			.addField(':gear: | Prefix', `> \`${client.prefix}\``)
			.addField(`:satellite: | \`${client.prefix}\`Help`, client.lang.events.message.isMentioned.field1)
			.addField(`❔ | ${client.lang.events.message.isMentioned.field2}`, `>>> [${client.lang.events.message.isMentioned.invite}](${invite})\n[Discord](${process.env.URL}discord)\n[Twitter](https://twitter.com/Theangel256)`)
			.setFooter(client.lang.events.message.isMentioned.footer + require('../../package.json').version, client.user.displayAvatarURL({ format: 'jpg', dynamic:true }))
			.setTimestamp()
			.setColor(0x00ffff);
		message.channel.send(embed).then(e => e.delete({ timeout: 120000 })).catch(e => console.log(e.message));
	}
	regExp(client, message);

	if(!message.content.startsWith(client.prefix)) {
		levels(message);
		return;
	}
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