const getMember = require('../structures/functions/getMember');
const Canvas = require('canvas')
const request = require('node-fetch');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, false);
	if (!member) return message.channel.send(client.lang.no_user);

	const canvas = Canvas.createCanvas(1080, 970);
	const ctx = canvas.getContext('2d');

	const a = await request('https://i.imgur.com/j5gNEmh.jpg');
	const fondo = await Canvas.loadImage(a);
	ctx.drawImage(fondo, 10, 10, 1080, 970);
	const b = await request(member.user.displayAvatarURL({ format: 'jpg' }));
	const avatar = await Canvas.loadImage(b);
	ctx.drawImage(avatar, 570, 10, 500, 460);
	const c = await request(message.author.displayAvatarURL({ format: 'jpg' }));
	const avatar1 = await Canvas.loadImage(c);
	ctx.drawImage(avatar1, 570, 465, 500, 510);
	const attachment = new client.Discord.MessageAttachment(canvas.toBuffer(), 'rankcard.png');
	message.channel.send(attachment);
};
module.exports.help = {
	name: 'drake',
	description: 'Usa este comando para decidir quien acepta el rapero drake o quien no!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['ATTACH_FILES'],
	ownerOnly: false,
};
