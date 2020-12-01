const db = require('quick.db');
module.exports.run = (client, message, args) => {
	const {getMember} = require('../structures/functions.js');
	const marrys = new db.table('marrys');
	const random = Math.ceil(Math.random() * 100),
		member = getMember(message, args, false);
	let love;
	if (!member) return message.channel.send(client.lang.no_user);
	if(random >= 0 && random < 10) love = `**${random}%** :broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart::broken_heart: **${random}%**`;
	else if(random >= 10 && random < 20) love = `**${random}%** :heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 20 && random < 30) love = `**${random}%** :heart::heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 30 && random < 40) love = `**${random}%** :heart::heart::heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 40 && random < 50) love = `**${random}%** :heart::heart::heart::heart::black_heart::black_heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 50 && random < 60) love = `**${random}%** :heart::heart::heart::heart::heart::black_heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 60 && random < 70) love = `**${random}%** :heart::heart::heart::heart::heart::heart::black_heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 70 && random < 80) love = `**${random}%** :heart::heart::heart::heart::heart::heart::heart::black_heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 80 && random < 90) love = `**${random}%** :heart::heart::heart::heart::heart::heart::heart::heart::black_heart::black_heart: **${random}%**`;
	else if(random >= 90 && random < 100) love = `**${random}%** :heart::heart::heart::heart::heart::heart::heart::heart::heart::black_heart: **${random}%**`;
	else if(random === 100) love = `**${random}%** :heart::heart::heart::heart::heart::heart::heart::heart::heart::heart: **${random}%**`;
	else love = `**${random}%** :heart::heart::heart::heart::heart::heart::heart::heart::heart::heart: **${random}%**`;
	if(marrys.has(`${message.author.id}.id`)) {
		if(marrys.fetch(`${message.author.id}.id`) === member.user.id) love = '**200%** :sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart: **200%**';
	}
	if(member.user.id === message.author.id) love = '**200%** :sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart::sparkling_heart: **200%**';
	if(member.user.bot) return message.channel.send(client.lang.commands.love.bot);
	const embed = new client.Discord.MessageEmbed()
		.setThumbnail('https://i.imgur.com/rRI5O0N.png')
		.setDescription(`__**:heartbeat::bow_and_arrow: ${client.lang.commands.love.relations} :bow_and_arrow::heartbeat:**__\n\n:small_red_triangle_down:${message.author.username}\n:small_red_triangle:${member.user.username}\n\n${love}`)
		.setColor('#a00f0f');
	message.channel.send(embed);
};
module.exports.help = {
	name: 'love',
	description: 'Usa este medidor de amor con otro miembro para saber si le eres fiel :3',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};