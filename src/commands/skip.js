module.exports.run = async (client, message) => {
  const fetched = client.queue.get(message.guild.id);

  if (!message.member.voice.channel)
    return message.channel.send("debes unirte a un canal de voz.");
  if (!fetched)
    return message.channel.send("No hay ninguna cancion en la cola");

  const userCount = message.member.voice.channel.members.size;

  const required = Math.ceil(userCount / 2);

  if (!fetched.songs[0].vote) {
    fetched.songs[0].vote = [];
  }
  if (fetched.songs[0].vote.includes(message.member.id)) {
    const pos = fetched.songs[0].vote.indexOf(message.member.id);
    fetched.songs[0].vote.splice(pos, 1);
    return message.channel.send(
      `Has quitado tu voto! ${fetched.songs[0].vote.length}/${required} requeridos.`
    );
  }
  fetched.songs[0].vote.push(message.member.id);
  if (fetched.songs[0].author.id === message.author.id) {
    message.channel.send(":white_check_mark: Cancion Saltada!");
    return await skip(fetched);
  } else if (message.member.permissions.has("MANAGE_MESSAGES")) {
    message.channel.send(":white_check_mark:Un DJ a Saltado la Cancion!");
    return await skip(fetched);
  } else if (fetched.songs[0].vote.length >= required) {
    message.channel.send(
      `:white_check_mark: Votos ${fetched.songs[0].vote.length}/${required} requeridos, cancion Saltada!`
    );
    return await skip(fetched);
  }
  message.channel.send(
    `Voto para saltar la cancion ${fetched.songs[0].vote.length}/${required} requeridos.`
  );
};
async function skip(queue) {
  await queue.connection.dispatcher.end();
}
module.exports.help = {
  name: "skip",
  description:
    "cansado de escuchar musica aburrida para esperar la favorita? esta es la perfecta opcion!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
