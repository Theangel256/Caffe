const { getMember } = require("../utils/functions.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
module.exports.run = (client, message, args) => {
  const usuario = getMember(message, args, true),
    color = {
      online: "#00c903",
      idle: "#ff9a00",
      dnd: "#ff0000",
      offline: "#d8d8d8",
    },
    estados = {
      online: "En Línea",
      idle: "Ausente",
      dnd: "No Molestar",
      offline: "Desconectado/invisible",
    };
  const permissions = [];
  if (usuario.permissions.has(PermissionsBitField.Flags.Administrator)) {
    permissions.push("Administrator");
  }
  if (usuario.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    permissions.push("Manage Roles");
  }
  if (usuario.permissions.has(PermissionsBitField.Flags.KickMember)) {
    permissions.push("Kick Members");
  }
  if (usuario.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    permissions.push("Ban Members");
  }
  if (usuario.permissions.has("MANAGE_NICKNAMES")) {
    permissions.push("Manage Nicknames");
  }
  if (usuario.permissions.has("MANAGE_EMOJIS")) {
    permissions.push("Manage Emojis");
  }
  if (usuario.permissions.has("MANAGE_NICKNAMES")) {
    permissions.push("Manage Nicknames");
  }
  if (usuario.permissions.has("MANAGE_WEBHOOKS")) {
    permissions.push("Manage Webhooks");
  }
  if (usuario.permissions.has("MANAGE_MESSAGES")) {
    permissions.push("Manage Messages");
  }
  if (usuario.permissions.has("MENTION_EVERYONE")) {
    permissions.push("Mention Everyone");
  }
  if (usuario.permissions.has("MUTE_MEMBERS")) {
    permissions.push("Mute Members");
  }
  if (usuario.permissions.has("DEAFEN_MEMBERS")) {
    permissions.push("Deafen Members");
  }
  if (permissions.length == 0) {
    permissions.push("None");
  }
  const embed = new EmbedBuilder()
    .setColor(color[usuario.presence.status])
    .setDescription(`Informacion del usuario ${usuario.user.username}`)
    .setThumbnail(usuario.user.displayAvatarURL({ extension: "webp"}))
    .setTimestamp()
    .setAuthor({
      name: usuario.user.tag,
      iconURL: usuario.user.displayAvatarURL({ extension: "webp"})
    })
    .addFields({
      name: "「:bust_in_silhouette: 」Nombre", value: usuario.user.tag, inline: true,
      name: "「:page_facing_up: 」Apodo", value: usuario.nickname || "Ninguno", inline: true,
      name: "「:bot: 」Bot", value: usuario.user.bot ? "Si" : "No", inline: true,
      name: "「:inbox_tray:」Estado", value: estados[usuario.presence.status], inline: true,
      name: "「:computer: 」Actividad", value: usuario.presence.activities.length > 0 ? usuario.presence.activities[0].name : "Ninguna", inline: true,
      name: "「:sparkles: 」Banner", value: `[Link](${usuario.user.bannerURL({ dynamic: true })})`, inline: true,
      name: "「:id:」ID", value: usuario.id, inline: true,
      name: "「:new:」Cuenta Creada", value: usuario.user.createdAt.toDateString(), inline: true,
      name: "「:calendar:」Ingresó", value: usuario.joinedAt.toDateString(), inline: true,
      name: "「:game_die:」Roles (" + usuario.roles.cache.size + ")", value: usuario.roles.cache.map((m) => m).join(", "),
      name: "「:gear:」Permisos", value: "```prolog\n" + permissions.join(", ") + "```"
})
  return message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "user-info",
  aliases: ["user"],
  description: "toda la informacion sobre un usuario mencionado",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["EMBED_LINKS"],
  ownerOnly: false,
};
