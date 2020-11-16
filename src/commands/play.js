const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyBxJ7Cw7cx8FQbC4xoDO5N8ToIsEbYEzzk");
const ytdl = require('ytdl-core')
module.exports.run = async (client, message, args) => {
	let msg;
	const queue = client.queue;
	const lang = client.lang.commands.play;
	const searchString = args.join(' '),
		url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const voiceChannel = message.member.voice.channel;
	if(!voiceChannel) return message.channel.send(client.lang.music.needJoin);
	if(message.member.voice.channel !== message.guild.me.voice.channel) message.member.voice.channel.join();
	if(!searchString) return message.reply(lang.no_args);

	if(url.match(/^https?:\/\/((www|beta)\.)?youtube\.com\/playlist(.*)$/)) {
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
		return handleVideo(voiceChannel, video, false);
	}
async function handleVideo (voiceChannel, video, playlist = false) {
	const lang = client.lang.commands.play;
	const serverQueue = queue.get(message.guild.id);
	const song = {
		id: video.id,
		title: client.Discord.Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		thumbnail: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
		channel: video.channel.title,
		durationh: video.duration.hours,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
		description: video.description,
		author: message.author,
		channelid: video.channel.id,
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 0.5,
			playing: true,
		};
		await queue.set(message.guild.id, queueConstruct);
		await queueConstruct.songs.push(song);
		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			await play(message.guild, queueConstruct.songs[0]);
		}catch(error) {
			console.error(`Ha ocurrido un error: ${error}`);
			await queue.delete(message.guild.id);
			return message.channel.send(lang.error);
		}
	}else{
		serverQueue.songs.push(song);
		if (playlist) return;
		else {
			const embedAddQueue = new client.Discord.MessageEmbed()
				.setColor('#a00f0f')
				.setAuthor(lang.addQueue, 'https://i.imgur.com/htXCtPo.gif')
				.setDescription(`[${song.title}](${song.url})`)
				.setImage(song.thumbnail)
				.setFooter(message.guild.name, message.guild.iconURL())
				.setTimestamp();
			return message.channel.send(embedAddQueue);
		}
	}
	return undefined;
}
	async function play (guild, song) {
		const lang = client.lang.commands.play;
		const serverQueue = await queue.get(guild.id);
		if(!song) {
			await serverQueue.voiceChannel.leave();
			await queue.delete(guild.id);
			return;
		}
		const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 });
		const dispatcher = await serverQueue.connection.play(stream)
		.on('finish', async () => {
			serverQueue.songs.shift();
			
			await play(guild, serverQueue.songs[0]);
			
		}).on('error', (error) => console.log(error));

		dispatcher.setVolume(1);
		let time;
		const timeget = serverQueue.songs[0];
		if(timeget.durationh < 1) {
			time = `${timeget.durationm}:${timeget.durations}`;
		}
		else if(timeget.durationh > 0) {
			time = `${timeget.durationh}:${timeget.durationm}:${timeget.durations}`;
		}
		const embedPlay = new client.Discord.MessageEmbed()
			.setAuthor(lang.embed.nowPlaying, 'https://i.imgur.com/htXCtPo.gif')
			.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
			.setImage(serverQueue.songs[0].thumbnail)
			.setColor('#a00f0f')
			.addField(lang.embed.time, time, true)
			.addField(lang.embed.channel, serverQueue.songs[0].channel, true)
			.setFooter(message.guild.name, message.guild.iconURL())
			.setTimestamp();
		return message.channel.send(embedPlay);

	}
}
module.exports.help = {
	name: 'play',
	description: 'Reproduce playlist, URL o titulo de tu musica favorita!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
	ownerOnly: false,
};