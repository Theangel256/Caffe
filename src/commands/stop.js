module.exports.run = async (client, message) => {
  const serverQueue = client.queue.get(message.guild.id);
  if (!message.member.voice.channel)
    return message.channel.send(
      "Debes unirte a un canal de voz para detener la canción."
    );

  if (!serverQueue)
    return message.channel.send("¡No hay canción!, la cola esta vacía.");

  const userCount = message.member.voice.channel.members.size;

  const required = Math.ceil(userCount / 2);

  if (!serverQueue.songs[0].voteStop) {
    serverQueue.songs[0].voteStop = [];
  }
  if (serverQueue.songs[0].voteStop.includes(message.member.id)) {
    const pos = serverQueue.songs[0].voteStop.indexOf(message.member.id);
    serverQueue.songs[0].voteStop.splice(pos, 1);
    return message.channel.send(
      `Has quitado tu voto! ${serverQueue.songs[0].voteStop.length}/${required} requeridos.`
    );
  }
  serverQueue.songs[0].voteStop.push(message.member.id);

  if (message.member.hasPermission("MANAGE_MESSAGES")) {
    skip(serverQueue);
    return message.channel.send(
      ":white_check_mark:Un DJ a Borrado la lista de Canciones!"
    );
  } else if (serverQueue.songs[0].voteStop.length >= required) {
    skip(serverQueue);
    return message.channel.send(
      `:white_check_mark: Votos ${serverQueue.songs[0].voteStop.length}/${required} requeridos, cola finalizada!`
    );
  }
  message.channel.send(
    `Voto para finalizar la cola ${serverQueue.songs[0].voteStop.length}/${required} requeridos.`
  );
};
async function skip(queue) {
  queue.songs = [];
  await queue.connection.dispatcher.end();
}
module.exports.help = {
  name: "stop",
  description: "ya no quieres escuchar musica? esta es la perfecta opcion!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
