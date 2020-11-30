const Canvas = require('canvas')
const getRank = require('../structures/functions/getRank');
const getMember = require('../structures/functions/getMember');
const { getData, updateData } = require('../structures/functions/databaseManager');
module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true);
	if(member.user.bot) return message.channel.send('los bots no tienen niveles');
	let niveles = await getData({ guildID: message.guild.id, userID: member.user.id}, "SystemLvl");
	if(!niveles) {
		updateData({guildID: message.guild.id, userID: member.user.id }, {xp: 0, lvl: 1}, 'SystemLvl')
		niveles = await getData({ guildID: message.guild.id, userID: member.user.id}, "SystemLvl");
	}
	const usuarios = await getRank(await getData({ guildID: message.guild.id, userID: member.user.id }, "SystemLvl"), message);
	let rank = usuarios.findIndex(u => u[0] == member.user.tag);
	if(rank === -1) rank = `#${usuarios.length}`;
	else rank = `#${rank + 1}`;
	const canvas = Canvas.createCanvas(934, 282);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, 934, 282);
	const fondo = await Canvas.loadImage('https://i.imgur.com/fM93m9e.png');
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', dynamic: true }));
	ctx.drawImage(fondo, 10, 10, 914, 262);

	ctx.lineWidth = 3;
	ctx.strokeStyle = '#ffffff';
	ctx.globalAlpha = 0.2;
	ctx.fillStyle = '#000000';
	ctx.fillRect(216, 150, 650, 60);
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.strokeRect(216, 150, 650, 60);
	ctx.stroke();

	ctx.fillStyle = '#7289DA';
	ctx.globalAlpha = 0.5;
	ctx.fillRect(216, 150, ((100 / (niveles.lvl * 80)) * niveles.xp) * 7.7, 60);
	ctx.fill();
	ctx.globalAlpha = 1;

	ctx.font = '30px Arial';
	ctx.textAlign = 'center';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${niveles.xp} / ${niveles.lvl * 80} XP`, 750, 140);

	ctx.font = '25px Arial';
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText('RANK', 580, 70);
	ctx.font = '50px Arial';
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText(rank, 670, 70);

	ctx.font = '25px Sans';
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText('LEVEL', 770, 70);
	ctx.font = '50px Arial';
	ctx.fillStyle = 'rgb(255, 255, 255)';
	ctx.fillText(niveles.lvl, 850, 70);

	ctx.font = '25px Arial';
	ctx.textAlign = 'left';
	ctx.fillText(member.user.tag, 220, 140);


	ctx.arc(125, 125, 85, 0, Math.PI * 2, true);
	ctx.lineWidth = 6;
	ctx.strokeStyle = '#ffffff';
	ctx.stroke();
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(avatar, 25, 25, 200, 200);
	const attachment = new client.Discord.MessageAttachment(canvas.toBuffer(), 'rankcard.png');

	message.channel.send(attachment);
};
module.exports.help = {
	name: 'rank',
	description: 'Muestra una carta con todos los datos de tu nivel',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['ATTACH_FILES'],
	ownerOnly: false,
};