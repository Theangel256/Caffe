  export async function run(client, message) {
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) return message.channel.send(client.lang.music.noQueue);

  if (!message.member.voice.channel)
    return message.channel.send(client.lang.music.needJoin);

  if (serverQueue.connection.dispatcher.paused) {
    return message.channel.send(client.lang.commands.pause.alreadyPaused);
  }
  serverQueue.playing = false;
  serverQueue.connection.dispatcher.pause(true);

  return message.channel.send(client.lang.commands.pause.sucess);
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
