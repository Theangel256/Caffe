export async function run(client, message, args) {
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue)
    return message.channel.send("¡No hay canción!, la cola esta vacía.");
  if (!args.join(" "))
    return message.channel.send(`El volumen es: **${serverQueue.volume}**`);

  const countVolumen = parseInt(args[0]);

  if (countVolumen <= 5 && countVolumen >= 0) {
    const dispatcher = serverQueue.connection.dispatcher;

    serverQueue.volume = countVolumen;
    dispatcher.setVolumeLogarithmic(countVolumen / 5);

    return message.channel.send(
      `**Volume:** \`${Math.round(serverQueue.volume * 50)}\`**%**`
    );
  } else {
    return message.channel.send("El volumen debe estar entre **0 a 5**");
  }
};
export const help = {
  name: "volume",
  description: "cambia el volumen de tu musica!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
