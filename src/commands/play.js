const play_dl = require("play-dl");
const axios = require("axios");
const { EmbedBuilder, PermissionsBitField, Colors } = require("discord.js");
const { StreamType,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState
 } = require('@discordjs/voice');
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

    if (!botVoiceChannel) await client.joinVoiceChannel(userVoiceChannel);

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
    var video = await play_dl.video_info(url); 
  } catch (error) {
    try {
      const videos = await searchYouTube(searchString);
      if (!videos) return message.channel.send(lang.invalidArgs.replace(/{searchString}/gi, searchString));
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
        filter: (x) => !isNaN(x.content) && Number(x.content) > 0 && Number(x.content) <= videos.length && x.author.id === message.author.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      } catch (e) { console.error("Tiempo expirado:", e.message); if (msg.deletable) setTimeout(() => msg.delete().catch(() => {}), 200); return message.channel.send(lang.expired).then((m) => setTimeout(() => m.delete().catch(() => {}), 5000)); }
    const videoIndex = Number(response.first().content);
    const selected = videos[videoIndex - 1];
    if (!selected) {
      return message.channel.send("Selección inválida.");
    }
    const videoUrl = `https://www.youtube.com/watch?v=${selected.id.videoId}`;
    try { video = await play_dl.video_info(videoUrl); } catch (err) { console.log("Error al obtener info del video:", err.message); return message.channel.send(lang.couldNotGetVideo); }

    response.first().delete().catch(() => {});
    if (msg.deletable) setTimeout(() => msg.delete().catch(() => {}), 200); 
    
  } catch (e) { console.error("Error en el bloque de selección:", e.message); return message.channel.send(lang.invalidArgs).replace(/{searchString}/gi, searchString).then((m) => setTimeout(() => m.delete().catch(() => {}), 5000)); }
}
  return handleVideo(video, false);

async function handleVideo(info, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    const details = info.video_details;
    const thumbnails = details.thumbnails;
    const song = {
    id: details.id,
    title: details.title,
    url: `https://www.youtube.com/watch?v=${details.id}`,
    thumbnail: thumbnails?.at(-1)?.url || null,
    duration: details.durationInSec.toString(),
    channel: details.channel?.name || "Desconocido",
    description: details.description,
    author: message.author,
  };

      if (!serverQueue) {
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: userVoiceChannel,
        connection: null,
        songs: [],
        volume: 0.5,
        playing: true,
      };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
    const connection = await client.joinVoiceChannel(userVoiceChannel); 
    queueConstruct.connection = connection;
    if(!connection) {
      queue.delete(message.guild.id); 
      return message.channel.send(lang.error.replace("{url}", process.env.PUBLIC_URL));
    }
    await playHandler(message.guild, queueConstruct.songs[0]);    
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
async function playHandler(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    if (serverQueue?.connection) serverQueue.connection.destroy();
    return queue.delete(guild.id);
  }
  if (!play_dl.validate(song.url)) {
  console.error("❌ URL no válida para play-dl:", song.url);
  return;
}
  try {
    const stream = await play_dl.stream(song.url, { quality: 0, discordPlayerCompatibility: true })
      if (!stream || !stream.stream) {
      return serverQueue.textChannel.send("❌ No se pudo obtener el stream.");
    }
    const resource = createAudioResource(stream.stream, {
  inputType: stream.type ?? StreamType.Arbitrary,
  inlineVolume: true,
  });
    resource.volume.setVolume(serverQueue.volume);
  const player = serverQueue.player || createAudioPlayer({
  behaviors: { noSubscriber: NoSubscriberBehavior.Pause }
  });
  serverQueue.player = player;
  
  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    playHandler(guild, serverQueue.songs[0]);
  });
  player.on('error', (error) => {
    console.log('🎵 Error en el reproductor:\n', error);
    serverQueue.textChannel.send("❌ Ocurrió un error durante la reproducción.");
    serverQueue.songs.shift();
    playHandler(guild, serverQueue.songs[0]);
  });
  player.play(resource);
  serverQueue.connection.subscribe(player);

setTimeout(() => {
  console.log("📈 Estado actual del reproductor:", player.state.status);
}, 2000);
  
  player.on('stateChange', (oldState, newState) => {
    console.log(`🎧 Estado del reproductor: ${oldState.status} -> ${newState.status}`);
  });
  player.on(AudioPlayerStatus.Playing, () => {
  console.log("▶️ Reproducción iniciada");
});

  const embedPlay = new EmbedBuilder()
    .setAuthor({ name: lang.embed.nowPlaying, iconURL: "https://i.imgur.com/htXCtPo.gif"})
    .setDescription(`[${song.title}](${song.url})`)
    .setImage(song.thumbnail)
    .setColor("#a00f0f")
    .addFields(
      { name: lang.embed.time, value: song.duration, inline: true },
      { name: lang.embed.channel, value: song.channel, inline: true }
    )
    .setFooter({ text: guild.name, iconURL: guild.iconURL()})
    .setTimestamp();

  serverQueue.textChannel.send({ embeds: [embedPlay] });
    } catch (err) {
    console.error("❌ Error al reproducir la canción:", err);
    serverQueue.textChannel.send("❌ Hubo un problema al intentar reproducir esta canción.");
    serverQueue.songs.shift();
    playHandler(guild, serverQueue.songs[0]);
  }
}

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
};
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
