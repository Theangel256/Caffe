const getMember = require('../structures/functions/getMember');

const commandcooldown = new Map(),
	moment = require('moment');
require('moment-duration-format');
module.exports.run = (client, message, args) => {
	if (commandcooldown.has(message.author.id)) {
		const cooldown = commandcooldown.get(message.author.id),
			duracion = moment.duration(cooldown - Date.now()).format('m [m], s [s]');
		if (Date.now() < cooldown) return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
	}
	if(message.deletable) message.delete();
	const member = getMember(message, args, false);
	const lang = client.lang.commands.dm;
	if(!member) return message.channel.send(client.lang.no_user);
	const mensaje = args.slice(1).join(' '),
		md = new client.Discord.MessageEmbed()
			.setDescription(lang.description).setTimestamp().setColor(0x00ffff)
			.addField(lang.field.title, client.prefix + lang.field.description, true)
			.addField(lang.field2.title, client.prefix + lang.field2.description, true)
			.setFooter('•Caffe-bot.com•', client.user.displayAvatarURL({ dynamic:true }));
	if (!mensaje) return message.channel.send(md);
	const embed = new client.Discord.MessageEmbed()
		.setTitle(':mailbox_with_mail:**__DM__**:mailbox_with_mail:')
		.addField(client.lang.commands.dm.field3.title, mensaje)
		.setFooter(client.lang.commands.dm.field3.footer.replace(/{guild.name}/gi, message.guild.name), message.guild.iconURL({ dynamic:true }))
		.setColor(0x00ffff);
	message.channel.send(client.lang.commands.dm.sucess).then(m => {
		m.delete({ timeout: 5000 }).catch(e => console.log(e.message));
	}).catch(e => console.log(e.message));
	member.user.send(embed).catch(e => message.channel.send(e.message));
	commandcooldown.set(message.author.id, Date.now() + 120000);
};
module.exports.help = {
	name: 'dm',
	description: 'Manda mensajes anonimos a una persona!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};