const YouTube = require('simple-youtube-api');
const { handleVideo } = require('../structures/functions.js'),
	youtube = new YouTube('AIzaSyC9RHQZWGh5vI01HQBe6MVWaNQQgmT12R8');
module.exports.run = async (client, message, args) => {
	let msg;
	const lang = client.lang.commands.play;
	const searchString = args.join(' '),
		url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	if(!searchString) {return message.reply(lang.no_args);}
	const voiceChannel = message.member.voice.channel;
	if(!voiceChannel) return message.channel.send(client.lang.music.needJoin);
	if(message.member.voice.channel !== message.guild.me.voice.channel) message.member.voice.channel.join();

	if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id);
			await handleVideo(client, message, voiceChannel, video2, true).catch(e => console.log(e.message));
		}
		return message.channel.send(lang.playlistAdded.replace(/{title}/gi, playlist.title));
	}else{
		try {
			var video = await youtube.getVideo(url);
		}
		catch(error) {
			try {
				const cantidad = 5;
				const videos = await youtube.searchVideos(searchString, cantidad);
				let index = 0;
				const embed = new client.Discord.MessageEmbed()
					.setTitle(lang.embed.title)
					.setDescription(`${videos.map(x => `**${++index}. [${x.title}](https://www.youtube.com/watch?v=${x.id})**`).join('\n')}`)
					.setColor('BLUE').setTimestamp()
					.setFooter(lang.embed.footer.replace(/{author.username}/gi, message.author.username), message.author.displayAvatarURL());
				msg = await message.channel.send(embed);
				try {
					var response = await message.channel.awaitMessages(x => x.content > 0 && x.content <= cantidad && x.author.id == message.author.id, { max: 1, time: 60000, errors: ['time'] });
				}
				catch (err) {
					console.error(err);
					if(msg.deletable) msg.delete({ timeout: 100 });
					return message.channel.send(lang.expired).then(m => m.delete({ timeout: 5000 }));
				}
				const videoIndex = parseInt(response.first().content);
				if(msg.deletable) msg.delete({ timeout: 100 });
				video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				response.first().delete();
			}
			catch(err) {
				console.error(err);
				return message.channel.send(lang.invalidArgs).then(m => m.delete({ timeout: 5000 }));
			}
		}
		return handleVideo(client, message, voiceChannel, video, false);
	}
};
module.exports.help = {
	name: 'play',
	description: 'Reproduce playlist, URL o titulo de tu musica favorita!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
	ownerOnly: false,
};