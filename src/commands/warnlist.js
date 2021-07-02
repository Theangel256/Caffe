const getRank = require("../structures/functions");
const warnMembers = require("../structures/models/warns");
module.exports.run = async (client, message, args) => {
  const msgDocument = await warnMembers
    .findOne({
      guildID: message.guild.id,
    })
    .catch((err) => console.log(err));
  if (!msgDocument) {
    try {
      const dbMsg = await new guildSystem({
        guildID: message.guild.id,
        prefix: process.env.prefix,
        language: "en",
        role: false,
        roletime: 0,
        kick: false,
        kicktime: 0,
        ban: false,
        bantime: 0,
      });
      var guilds = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    guilds = msgDocument;
  }
  if (!warns.has(message.guild.id))
    return message.channel.send("No hay ninguno usuario sancionado.");

  const usuarios = getRank(warns.get(message.guild.id), message);
  usuarios.map(
    (usuario, index) =>
      (usuarios[index] = `> #${index + 1} ${usuario[0]} | Warns: ${
        usuario[1]
      } | Reason: ${usuario[2]}`)
  );
  const paginas = [];
  const cantidad = 10;

  while (usuarios.length > 0) {
    paginas.push(usuarios.splice(0, cantidad));
  }
  const embed = new client.Discord.MessageEmbed()
    .setColor("RANDOM")
    .setThumbnail(message.guild.iconURL({ dynamic: true }));
  if (!args[0]) {
    embed.setDescription(
      `Warnlist del servidor ${message.guild.name} (pagina 1 de ${
        paginas.length
      })\n\n${paginas[0].join("\n")}`
    );
    return message.channel.send(embed);
  }
  if (isNaN(args[0]))
    return message.channel.send("Necesitas ingresar el numero de la pagina");

  const seleccion = parseInt(args[0]);

  if (seleccion <= 0 || seleccion > paginas.length)
    return message.channel.send(`La pagina ${seleccion} no existe.`);

  embed.setDescription(
    `Warnlist del servidor ${message.guild.name} (pagina ${seleccion} de ${
      paginas.length
    })\n\n${paginas[seleccion - 1].join("\n")}`
  );
  return message.channel.send(embed);
};
module.exports.help = {
  name: "warnlist",
  description: "Muestra la lista de usuarios mal portados :/",
};
module.exports.requirements = {
  userPerms: ["MANAGE_MESSAGES"],
  clientPerms: ["EMBED_LINKS"],
  ownerOnly: false,
};
