const request = require('request');
const { muteSystem } = require('../structures/functions')
module.exports = async (client) => {
	setInterval(async function () {
		muteSystem(client);
    }, 10000)
	const statues = [`/help | ${client.users.cache.size.toLocaleString()} users!`,
		'Theangel256 Studios V' + require('../../package.json').version, 'discord.caffe-bot.com', 'add.caffe-bot.com',"Powered By CentralHost.es"];
	setInterval(function() {
		const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
		client.user.setPresence({ activity: { name: status }, status: 'online' });
	}, 20000);
	const guild = client.guilds.cache.get('498164647833239563');
	const discTotalCh = client.channels.cache.get('607007646704205855');
	const discOnlineCh = client.channels.cache.get('606251126244900874');
	const minecraftOn = client.channels.cache.get('606534123795906570');
	const minecraftInline = client.channels.cache.get('606317624401592331');
	if(!discOnlineCh && !(guild) && !(discTotalCh) && !(minecraftInline) && !(minecraftOn)) return;
	const canales = guild.channels.cache.filter((x) => [discOnlineCh.id, discTotalCh.id, minecraftInline.id, minecraftOn.id].includes(x.id)).filter((x) => x.permissionsFor(guild.me).has('MANAGE_CHANNELS'))
	if(canales.size < 4) return console.error('Hay uno o mas canales en los que no tengo permisos');
	setInterval(() => {
		discOnlineCh.setName(`Discord Online: ${guild.members.cache.filter(x => x.user.presence.status !== 'offline').size}`);
		discTotalCh.setName(`Discord Total: ${guild.memberCount}`);
		request('https://api.minetools.eu/ping/Landiacraft.com/25565', function(err, resp, body){
			if(err) return console.log(err.message);
			body = JSON.parse(body);
			if(body.error) return console.log("Error | Servidor fuera de linea o no disponible.");
					if(body.players.online) {
						minecraftInline.setName(`Minecraft: ${body.players.online}/${body.players.max}`);
						minecraftOn.setName('Minecraft: Encendido');
					} else {
						minecraftOn.setName('Minecraft: Apagado');
						minecraftInline.setName('Minecraft: 0');
					}
			});
	}, 10000);
	}