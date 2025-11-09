import { PermissionsBitField, EmbedBuilder } from "discord.js";
import warnMembers from "../utils/models/warns.js";
export async function run(client, message, args) {
  const warnList = await warnMembers.find({
  guildID: message.guild.id,
  warnings: { $gt: 0 } // solo los que tengan 1 o más advertencias
});
  if (!warnList || warnList.length === 0) {
    return message.channel.send("No hay ningún usuario sancionado.");
  }
    const usuarios = warnList.map((warnDoc) => {
    const allReasons = warnDoc.reasons ? warnDoc.reasons.join(", ") : "Sin razón especificada";
    return [
      `<@${warnDoc.userID}>`,
      warnDoc.warnings,
      allReasons
    ];
  });
  usuarios.sort((a, b) => b[1] - a[1]);

  const paginas = [];
  const cantidad = 10;
  while (usuarios.length > 0) {
    paginas.push(usuarios.splice(0, cantidad));
  }
    const page = args[0] ? parseInt(args[0]) : 1;
    const embed = new EmbedBuilder()
    .setColor("Random")
    .setThumbnail(message.guild.iconURL({ dynamic: true }));
  if (isNaN(page) || page <= 0 || page > paginas.length) {
    return message.channel.send(`La página ${args[0] || 1} no existe.`);
  }
  const contenido = paginas[page - 1]
    .map(
      (usuario, index) =>
        `> #${(page - 1) * cantidad + index + 1} ${usuario[0]} | Warns: ${usuario[1]} | Reason: ${usuario[2]}`
    )
    .join("\n");
  embed.setDescription(
    `Warnlist del servidor ${message.guild.name} (página ${page} de ${paginas.length})\n\n${contenido}`
  );
  return message.channel.send({ embeds: [embed] });
};
export const help = {
  name: "warnlist",
  description: "Muestra la lista de usuarios mal portados :/",
};
export const requirements = {
  userPerms: [PermissionsBitField.Flags.ManageMessages],
  clientPerms: [PermissionsBitField.Flags.EmbedLinks],
  ownerOnly: false,
};
