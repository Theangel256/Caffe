const request = require('request');
const { iteracion_mute } = require('../structures/functions')
module.exports = async (client) => {
	setInterval(async function () {
		iteracion_mute(client);
    }, 10000)
	const statues = [`/help | ${client.users.cache.size.toLocaleString()} users!`,
		'Theangel256 Studios V' + require('../../package.json').version, 'discord.caffe-bot.com', 'add.caffe-bot.com',"Powered By CentralHost.es"];
	setInterval(function() {
		const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
		client.user.setPresence({ activity: { name: status }, status: 'online' });
	}, 20000);
	const canal = client.channels.cache.get('606251126244900874'),
		guild = client.guilds.cache.get('498164647833239563'),
		canal2 = client.channels.cache.get('607007646704205855');
	const canal3 = client.channels.cache.get('606317624401592331'),
		canal4 = client.channels.cache.get('606534123795906570');
	if(!canal && !(guild) && !(canal2) && !(canal3) && !(canal4)) return;
	if(!guild.member(client.user).hasPermission(["MANAGE_CHANNELS"])) return;
	setInterval(() => {
		canal.setName(`Discord Online: ${guild.members.cache.filter(x => x.user.presence.status !== 'offline').size}`);
		canal2.setName(`Discord Total: ${guild.memberCount}`);
		request('https://api.minetools.eu/ping/Landiacraft.com/25565', function(err, resp, body){
			if(err) return console.log(err.message);
			body = JSON.parse(body);
			if(body.error) return console.log("Error | Servidor fuera de linea o no disponible.")
					if(body.players.online) {
						canal3.setName(`Minecraft: ${body.players.online}/${body.players.max}`);
						canal4.setName('Minecraft: Encendido');
					} else {
						canal4.setName('Minecraft: Apagado');
						canal3.setName('Minecraft: 0');
					}
			});
	}, 10000);
	}