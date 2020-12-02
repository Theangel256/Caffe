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
	const guild = client.guilds.cache.get('738692537329516565');
	const discOnlineCh = client.channels.cache.get('606251126244900874');
	const discTotalCh = client.channels.cache.get('607007646704205855');
	const minecraftInline = client.channels.cache.get('783450505832562688');
	const minecraftOn = client.channels.cache.get('783450524154331152');
	if(!(guild) && !(discTotalCh) && !(discOnlineCh) && !(minecraftInline) && !(minecraftOn)) return;
	const channels = guild.channels.cache.filter((x) => [discOnlineCh.id, discTotalCh.id, minecraftInline.id, minecraftOn.id].includes(x.id));
	if(!channels.permissionsFor(guild.me).has('MANAGE_CHANNELS')) return;
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