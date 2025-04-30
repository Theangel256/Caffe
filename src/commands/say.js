const { EmbedBuilder } = require("discord.js");
module.exports.run = (client, message, args) => {
  if (message.deletable) message.delete();
  if (!args[0]) return message.channel.send("Nada para decir? `Ej: /say Hola o /say embed Hola o /say image url.com`")
    .then((m) => m.delete({ timeout: 5000 }));
  let emoji;
  message.content.split(" ").map((x) => {
    if (x.startsWith(":") && x.endsWith(":"))
      emoji = client.emojis.cache.find((r) => r.name === x.slice(1, -1));
    else x;
  });
  const roleColor = message.guild.me.displayHexColor;
  switch (args[0].toLowerCase()) {
    case "image":
      {
        if (!args[1]) {
          return message.channel.send("Nada para ver? `Ej: /say image url.com`")
            .then((m) => m.delete({ timeout: 5000 }));
        }
        if (!/https?:\/\/.+\.(?:png|jpg|jpeg|gif)/g.test(args[1])) {
          return message.channel.send("esta no es una url, o no tiene el formato permitido `png, jpg, jpeg, gif`\nEjemplo: `/say image https://tudominio.com/api/example.png`");
        }
        const embed = new EmbedBuilder()
          .setImage(args.slice(1).join(" "))
          .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);
        message.channel.send({ embeds: [embed] });
      }
      break;
    case "embed":
      {
        if (!args[1]) return message.channel.send("Nada para decir? `Ej: /say embed Hola`")
            .then((m) => m.delete({ timeout: 5000 }));
        const embed = new EmbedBuilder();
        if (!emoji) {
          embed.setDescription(args.slice(1).join(" "));
        } else {
          const descReplace = new RegExp(`:${emoji.name}:`);
          const replace = args
            .slice(1)
            .join(" ")
            .replace(descReplace, `<a:${emoji.name}:${emoji.id}>`);
          embed.setDescription(replace);
        }
        embed.setColor(roleColor === "#000000" ? "#ffffff" : roleColor);
        message.channel.send({ embeds: [embed] });
      }
      break;
    default: {
      if (!emoji) {
        message.channel.send(args.join(" "));
      } else {
        const descReplace = new RegExp(`:${emoji.name}:`);
        const replace = args
          .join(" ")
          .replace(descReplace, `<a:${emoji.name}:${emoji.id}>`);
        message.channel.send(replace);
      }
    }
  }
};
module.exports.help = {
  name: "say",
  description:
    "Tienes algo que decir pero no quieres que te critiquen? usa este comando!",
};
module.exports.requirements = {
  userPerms: ["MANAGE_MESSAGES"],
  clientPerms: [],
  ownerOnly: false,
};
