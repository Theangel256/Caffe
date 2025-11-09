export async function run(client, message, lang) {
  const langCommand = lang.commands.move,
    serverQueue = client.queue.get(message.guild.id);

  if (!message.guild.member(client.user).voice.channel)
    return message.channel.send(langCommand.disconnected);

  if (!serverQueue) return message.channel.send(langCommand.noQueue);

  if (!message.member.voice.channel)
    return message.channel.send(lang.music.needJoin);

  if (message.member.voice.channel === message.guild.me.voice.channel)
    return message.channel.send(langCommand.already_connected);

  if (message.member.voice.channel !== message.guild.me.voice.channel)
    message.member.voice.channel.join();

  message.channel.send(
    `${langCommand.sucess} **${message.member.voice.channel.name}**`
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
