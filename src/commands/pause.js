  export async function run(client, message, lang) {
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) return message.channel.send(lang.music.noQueue);

  if (!message.member.voice.channel)
    return message.channel.send(lang.music.needJoin);

  if (serverQueue.connection.dispatcher.paused) {
    return message.channel.send(lang.commands.pause.alreadyPaused);
  }
  serverQueue.playing = false;
  serverQueue.connection.dispatcher.pause(true);

  return message.channel.send(lang.commands.pause.sucess);
};
export const help = {
  name: "pause",
  description: "Vas al baño? pausa tu musica!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
