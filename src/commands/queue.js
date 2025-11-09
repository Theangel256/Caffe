import { EmbedBuilder, PermissionsBitField } from "discord.js";

export function run(client, message, args, lang) {
  const serverQueue = client.queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send(lang.music.noQueue);

  const queue = serverQueue.songs,
    page = parseInt(queue.length / 10),
    embed = new EmbedBuilder()
      .setTitle(lang.commands.queue.embed.title.replace(/{guild.name}/gi, message.guild.name))
      .setColor("#0099ff")
      .setThumbnail(message.guild.iconURL({ extension: "webp"}));
  if (queue.length < 10) {
    const lista = [];
    for (let i = 0; i < queue.length; i++) {
      lista.push(
        lang.commands.queue.embed.description
          .replace(/{i}/gi, i + 1)
          .replace(/{title}/gi, queue[i].title)
          .replace(/{url}/gi, queue[i].url)
          .replace(/{author.username}/gi, queue[i].author.username)
      );
    }
    embed.setDescription(lista.join("\n"));
  } else {
    const uwu = [];

    if (args[0]) {
      // eslint-disable-next-line no-var
      var numero = parseInt(args[0]);
      numero--;
      numero = numero * 10;
    } else {
      numero = 0;
    }
    embed.setFooter(
      lang.commands.queue.page
        .replace(/{seleccion}/gi, numero)
        .replace(/{page}/gi, page)
    );
    for (let i = 0; i < 10; i++) {
      if (args[0]) {
        if (numero > page * 10) numero = page * 10;
      } else {
        numero = 0;
      }
      if (i + numero + 1 > queue.length) {
        return message.channel.send(
          lang.commands.queue.max.replace(/{seleccion}/gi, numero)
        );
      }

      uwu.push(
        lang.commands.queue.embed.description
          .replace(/{i}/gi, i + numero + 1)
          .replace(/{title}/gi, queue[i + numero].title)
          .replace(/{url}/gi, queue[i + numero].url)
          .replace(/{author.username}/gi, queue[i + numero].author.username)
      );
    }
    embed.setDescription(uwu.join("\n"));
  }
  message.channel.send({ embeds: [embed] });
};
export const help = {
  name: "queue",
  description: "Ve la cola de canciones de el servidor",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.EmbedLinks],
  ownerOnly: false,
};
