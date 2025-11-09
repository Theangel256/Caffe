import { PermissionsBitField } from "discord.js";
import mech_aki from "mech-aki";
export async function run(client, message) {
  const akinator = new mech_aki("es");
  let pregunta = await akinator.empezar().catch((err) => {
    console.log(err);
    return message.reply("No se ha podido iniciar la partida de Akinator, intenta de nuevo más tarde.");
  })
  const embed = { color: "RANDOM", title: pregunta.pregunta };
  const respuestas = new Map([
    ["✅", 0],
    ["❌", 1],
    ["❓", 2],
    ["🤔", 3],
    ["😞", 4],
    ["🔙", -9],
  ]);
  const array_respuestas = ["✅", "❌", "❓", "🤔", "😞", "🔙"];
  embed.fields = [{ name: "Opciones", value: "✅: Sí\n❌: No\n❓: No lo sé\n🤔: Probablemente sí\n😞: Probablemente no\n🔙: Atrás", inline: false}];
  const msg = await message.reply({ embeds: [embed] });
  for (let index = 0; index < array_respuestas.length; index++) {
    await msg.react(array_respuestas[index]);
  }
  while (akinator.progreso < 85) {
    const respuesta = await new Promise((resolve, reject) => {
      const collector = msg.createReactionCollector(
        (reaction, user) =>
          !user.bot &&
          user.id === message.author.id &&
          reaction.message.channel.id === msg.channel.id,
        { time: 60000 }
      );
      collector.on("collect", (r) => {
        resolve(r.emoji.name);
        r.users.remove(message.author);
        collector.stop();
      });
      collector.on("end", () => resolve(null));
    });
    if (!respuesta) return msg.delete();
    const respuesta_num = respuestas.get(respuesta);
    pregunta =
      respuesta_num != -9
        ? await akinator.siguiente(respuesta_num)
        : await akinator.atras();
    embed.title = pregunta.pregunta;
    await msg.edit(embed);
  }

  const personajes = await akinator.respuestas();
  embed.title = "✅Tu personaje es: " + personajes[0].nombre
  embed.description = personajes[0].descripcion ;
  embed.image.url = personajes[0].foto;
  embed.fields = [];
  msg.delete();
  message.reply(embed);
};
export const help = {
  name: "akinator",
  aliases: ["aki"],
  description: "Deja que Akinator descubra lo que hay en tu mente",
};
export const requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.EmbedLinks
  ],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 3,
  cooldown: 20000,
};
