const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data.sqlite');
const Canvas = require('canvas');
const { getMember, getRank } = require('../structures/functions.js');

module.exports.run = async (client, message, args) => {
	const member = getMember(message, args, true);
	if(member.user.bot) return message.channel.send('los bots no tienen niveles');
	db.get(`SELECT * FROM levelSystem WHERE idguild = ${message.guild.id}`, async (err, filas) => {
		if (err) return console.error('rank.js\n' + err.message);
		if(!filas) {
			db.run(`INSERT INTO levelSystem(idguild, idusuario, lvl, exp) VALUES(${message.guild.id}, ${message.author.id}, 0, 1)`, function(err) {
				if (err) return console.error('rank.js\n' + err.message);
			});
		}
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
		ctx.fillRect(216, 150, ((100 / (filas.lvl * 60)) * filas.exp) * 6.5, 60);
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.font = '30px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`${filas.exp} / ${filas.lvl * 60} XP`, 750, 140);

		ctx.font = '25px Arial';
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText('RANK', 580, 70);

		db.all('SELECT idguild, idusuario, lvl, exp FROM levelSystem ORDER BY lvl DESC LIMIT 10', async (err, users) => {
			if (err) return console.error(err.message);
			console.log(users);
			const usuarios = await getRank(users, message);
			let rank = usuarios.findIndex(u => u[0] === member.user.tag);
			if(rank === -1) rank = `#${usuarios.length}`;
			else rank = `#${rank + 1}`;
			ctx.font = '50px Arial';
			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.fillText(rank, 670, 70);
		});


		ctx.font = '25px Sans';
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText('LEVEL', 770, 70);
		ctx.font = '50px Arial';
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText(filas.lvl, 850, 70);
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
	});
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