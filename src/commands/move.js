export async function run(client, message) {
  const lang = client.lang.commands.move,
    serverQueue = client.queue.get(message.guild.id);

  if (!message.guild.member(client.user).voice.channel)
    return message.channel.send(lang.disconnected);

  if (!serverQueue) return message.channel.send(lang.noQueue);

  if (!message.member.voice.channel)
    return message.channel.send(client.lang.music.needJoin);

  if (message.member.voice.channel === message.guild.me.voice.channel)
    return message.channel.send(lang.already_connected);

  if (message.member.voice.channel !== message.guild.me.voice.channel)
    message.member.voice.channel.join();

  message.channel.send(
    `${lang.sucess} **${message.member.voice.channel.name}**`
  );
};
export const help = {
  name: "move",
  description: "Mueveme de canal cuando este reproduciendo musica",
};
export const requirements = {
  userPerms: [],
  clientPerms: ["CONNECT"],
  ownerOnly: false,
};
