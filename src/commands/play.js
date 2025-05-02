const ytdl = require("ytdl-core");
const axios = require("axios");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
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
      var videos = await searchYouTube(searchString);
      if (!videos) return message.channel.send(lang.invalidArgs.replace(/{searchString}/gi, searchString));
      videos.map((x) => { console.log(x.id); });
      let index = 0;
      const embed = new EmbedBuilder()
        .setTitle(lang.embed.title)
        .setDescription(
          videos.map((x) => `**${++index}. [${x.snippet.title}](https://www.youtube.com/watch?v=${x.id.videoId})**`)).join("\n")
        .setColor("BLUE")
        .setTimestamp()
        .setFooter({ text: lang.embed.footer.replace(/{author.username}/gi, message.author.username), iconURL: message.author.displayAvatarURL({ extension: "png" })});
      msg = await message.channel.send({ embeds: [embed] });
      try {
        var response = await message.channel.awaitMessages({
          filter: (x) => x.content > 0 && x.content <= cantidad && x.author.id === message.author.id,
          max: 1,
          time: 60000,
          errors: ["time"]
        });
      } catch (e) {
        console.error(e.message);
        if (msg.deletable) setTimeout(() => msg.delete(), 200);
        return message.channel.send(lang.expired).then((m) =>
          setTimeout(() => m.delete().catch(() => {}), 5000)
        );
      }
      const videoIndex = parseInt(response.first().content);
      if (msg.deletable) setTimeout(() => msg.delete(), 200);
      video = await ytdl.getBasicInfo(videos[videoIndex - 1].id.videoId);
      response.first().delete();
    } catch (e) {
      console.error(e.message);
      return message.channel.send(lang.invalidArgs).then((m) =>
        setTimeout(() => m.delete().catch(() => {}), 5000)
      );
    }
  }
  return handleVideo(video, false);
  // }
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
        userVoice,
        connection: null,
        songs: [],
        volume: 0.5,
        playing: true,
      };
      await queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);
      try {
        const [connection] = await Promise.all([userVoice.join()]);
        queueConstruct.connection = connection;
        await play(message.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(`Ha ocurrido un error: ${error}`);
        await queue.delete(message.guild.id);
        return message.channel.send(
          lang.error.replace("{url}", process.env.URL)
        );
      }
    } else {
      serverQueue.songs.push(song);
      if (playlist) {
        return;
      } else {
        const embedAddQueue = new EmbedBuilder()
          .setColor("#a00f0f")
          .setAuthor(lang.addQueue, "https://i.imgur.com/htXCtPo.gif")
          .setDescription(`[${song.title}](${song.url})`)
          .setImage(song.thumbnail)
          .setFooter(message.guild.name, message.guild.iconURL())
          .setTimestamp();
        return message.channel.send(embedAddQueue);
      }
    }
    return undefined;
  }
  async function play(guild, song) {
    const serverQueue = await queue.get(guild.id);
    if (!song) {
      await serverQueue.userVoice.leave();
      await queue.delete(guild.id);
      return;
    }
    const stream = ytdl(song.url, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const dispatcher = await serverQueue.connection
      .play(stream)
      .on("finish", async () => {
        serverQueue.songs.shift();

        await play(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolume(0.5);
    const embedPlay = new EmbedBuilder()
      .setAuthor(lang.embed.nowPlaying, "https://i.imgur.com/htXCtPo.gif")
      .setDescription(
        `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`
      )
      .setImage(serverQueue.songs[0].thumbnail)
      .setColor("#a00f0f")
      .addFields(
        { name: lang.embed.time, value: serverQueue.songs[0].duration, inline: true, },
        { name: lang.embed.channel, value: serverQueue.songs[0].channel, inline: true }
  )
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();
    return message.channel.send(embedPlay);
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
    return data.items;
  } catch (err) {
    console.error("Error en búsqueda de YouTube:", err.message);
    return null;
  }
}
