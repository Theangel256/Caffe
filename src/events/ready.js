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
	const guild = (await client.guilds.fetch('738692537329516565'));
	const discOnlineCh = (await client.channels.fetch('606251126244900874'));
	const discTotalCh = (await client.channels.fetch('607007646704205855'));
	const minecraftInline = (await client.channels.fetch('783450505832562688'));
	const minecraftOn = (await client.channels.fetch('783450524154331152'));
	if(!discOnlineCh && !(guild) && !(discTotalCh) && !(minecraftInline) && !(minecraftOn)) return;
	if(!guild.member(client.user).hasPermission(["MANAGE_CHANNELS"])) return;
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