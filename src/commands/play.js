const ytdl = require("ytdl-core");
const axios = require("axios");
const { EmbedBuilder, PermissionsBitField, Colors } = require("discord.js");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");
module.exports.run = async (client, message, args) => {
  let msg;
    const queue = client.queue, 
    lang = client.lang.commands.play,
    searchString = args.join(" "),
    url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : ""
    const userVoiceChannel = message.member.voice.channel;
    const botVoiceChannel = message.guild.members.me.voice.channel;

    if (!userVoiceChannel) return message.channel.send(client.lang.music.needJoin);

    if (botVoiceChannel && userVoiceChannel.id !== botVoiceChannel.id)
      return message.channel.send(client.lang.music.alreadyPlaying.replace(/{channel}/gi, botVoiceChannel.name));
  
    if (!botVoiceChannel) client.joinVoiceChannel(userVoiceChannel);

  if (!searchString) return message.reply(lang.no_args);
  /*
	if(url.match(/^https?:\/\/((www|beta)\.)?youtube\.com\/playlist(.*)$/)) {
		const playlist = await youtube.getPlaylist(url);
		const videos = await playlist.getVideos();
		for (const video of Object.values(videos)) {
			const video2 = await youtube.getVideoByID(video.id);
			await handleVideo(video2, true);
		}
		return message.channel.send(lang.playlistAdded.replace(/{title}/gi, playlist.title));
	}
	else{
		*/
  try {
    
    var video = await ytdl.getBasicInfo(url);
  } catch (error) {
    try {
      const videos = await searchYouTube(searchString);
      if (!videos) return message.channel.send(lang.invalidArgs.replace(/{searchString}/gi, searchString));
      videos.forEach((x) => console.log(x.id));
      const embed = new EmbedBuilder()
        .setTitle(lang.embed.title)
        .setDescription(videos.map((x, i) => `**${i + 1}. [${x.snippet.title}](https://www.youtube.com/watch?v=${x.id.videoId})**`).join("\n"))
        .setColor(Colors.Blue)
        .setTimestamp()
        .setFooter({ text: lang.embed.footer.replace(/{author.username}/gi, message.author.username), iconURL: message.author.displayAvatarURL({ extension: "webp"})});
      msg = await message.channel.send({ embeds: [embed] });
      let response;
      try {
        response = await message.channel.awaitMessages({
        filter: (x) =>
          !isNaN(x.content) &&
          Number(x.content) > 0 &&
          Number(x.content) <= videos.length &&
          x.author.id === message.author.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      } catch (e) {
      console.error("Tiempo expirado:", e.message);
      if (msg.deletable) setTimeout(() => msg.delete().catch(() => {}), 200);
      return message.channel.send(lang.expired).then((m) => setTimeout(() => m.delete().catch(() => {}), 5000));
    }
    const videoIndex = Number(response.first().content);
    const selected = videos[videoIndex - 1];
    if (!selected) {
      return message.channel.send("Selección inválida.");
    }
    const videoUrl = `https://www.youtube.com/watch?v=${selected.id.videoId}`;
    console.log("Video seleccionado:", videoUrl);
    
    if (!ytdl.validateURL(videoUrl)) {
      console.error("URL inválida para ytdl:", videoUrl);
      return message.channel.send("La URL del video no es válida.");
    }
    try { 
    video = await ytdl.getBasicInfo(videoUrl);

    } catch (err) {
      console.error("Error al obtener info del video:", err.message);
      return message.channel.send("No se pudo obtener el video.");
    }

    response.first().delete().catch(() => {});
    if (msg.deletable) setTimeout(() => msg.delete().catch(() => {}), 200);
      } catch (e) {
    console.error("Error en el bloque de selección:", e.message);
    return message.channel.send(lang.invalidArgs).then((m) =>
      setTimeout(() => m.delete().catch(() => {}), 5000)
    );
  }
}
  return handleVideo(video, false);
    async function handleVideo(info, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    const thumbnails = info.videoDetails.thumbnails;
    const song = {
      id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      url: `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`,
      thumbnail: thumbnails.at(-1)?.url || null,
      duration: info.videoDetails.lengthSeconds,
      channel: info.videoDetails.ownerChannelName,
      description: info.videoDetails.description,
      author: message.author,
    };
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        userVoiceChannel, userVoiceChannel,
        connection: null,
        songs: [],
        volume: 0.5,
        playing: true,
      };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
  try {
    const connection = client.joinVoiceChannel(userVoiceChannel); 

    queueConstruct.connection = connection;

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    
    await play(message.guild, queueConstruct.songs[0]);
  } catch (error) {
    console.error(`Error al conectar al canal de voz: ${error}`);
    queue.delete(message.guild.id);
    return message.channel.send(lang.error.replace("{url}", process.env.URL));
  }
    } else {
      serverQueue.songs.push(song);
      if (playlist) {
        return;
      } else {
        const embedAddQueue = new EmbedBuilder()
          .setColor("#a00f0f")
          .setAuthor({ name: lang.addQueue, iconURL: "https://i.imgur.com/htXCtPo.gif" })
          .setDescription(`[${song.title}](${song.url})`)
          .setImage(song.thumbnail)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        return message.channel.send({ embeds: [embedAddQueue] });
      }
    }
  }
    async function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }

  // Crea stream con ytdl-core (solo audio)
  const stream = ytdl(song.url, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  });

  const resource = createAudioResource(stream);
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });

  player.play(resource);
  serverQueue.connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  });

  player.on("error", (error) => console.error(error));
  const embedPlay = new EmbedBuilder()
    .setAuthor(lang.embed.nowPlaying, "https://i.imgur.com/htXCtPo.gif")
    .setDescription(`[${song.title}](${song.url})`)
    .setImage(song.thumbnail)
    .setColor("#a00f0f")
    .addFields(
      { name: lang.embed.time, value: song.duration, inline: true },
      { name: lang.embed.channel, value: song.channel, inline: true }
    )
    .setFooter(message.guild.name, message.guild.iconURL())
    .setTimestamp();

  serverQueue.textChannel.send({ embeds: [embedPlay] });
}
};
async function searchYouTube(query, maxResults = 5) {
  const apiKey = process.env.YT_KEY;
  if (!apiKey) throw new Error("Clave de API de YouTube no definida (YT_KEY).");

  const url = `https://www.googleapis.com/youtube/v3/search`;
  const params = {
    part: "snippet",
    maxResults,
    q: query,
    type: "video",
    key: apiKey
  };

  try {
    const { data } = await axios.get(url, { params });
    if (!data.items || data.items.length === 0) {
      return null; // No hay resultados
    }
    return data.items.filter(item => item.id.kind === "youtube#video");
  } catch (err) {
    console.error("Error en búsqueda de YouTube:", err.message);
    return null;
  }
}
module.exports.help = {
  name: "play",
  description: "Reproduce playlist, URL o titulo de tu musica favorita!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.ManageChannels
    ],
  ownerOnly: false,
};
