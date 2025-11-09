export async function run(client, message, lang) {
  const fetched = client.queue.get(message.guild.id);

  if (!fetched) return message.channel.send(lang.music.noQueue);

  if (!message.member.voice.channel)
    return message.channel.send(lang.music.needJoin);

  if (!fetched.connection.dispatcher.paused)
    return message.channel.send("La musica no esta pausada");

  fetched.playing = true;
  await fetched.connection.dispatcher.resume();

  message.channel.send("Canción actual reanudada.");
};
export const help = {
  name: "resume",
  description: "Ya viniste del baño? resume tu lista de canciones",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
