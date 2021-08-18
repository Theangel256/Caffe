const { getMember } = require("../functions");
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
  if (usuario.hasPermission("ADMINISTRATOR")) {
    permissions.push("Administrator");
  }
  if (usuario.hasPermission("MANAGE_ROLES")) {
    permissions.push("Manage Roles");
  }
  if (usuario.hasPermission("KICK_MEMBERS")) {
    permissions.push("Kick Members");
  }
  if (usuario.hasPermission("BAN_MEMBERS")) {
    permissions.push("Ban Members");
  }
  if (usuario.hasPermission("MANAGE_NICKNAMES")) {
    permissions.push("Manage Nicknames");
  }
  if (usuario.hasPermission("MANAGE_EMOJIS")) {
    permissions.push("Manage Emojis");
  }
  if (usuario.hasPermission("MANAGE_NICKNAMES")) {
    permissions.push("Manage Nicknames");
  }
  if (usuario.hasPermission("MANAGE_WEBHOOKS")) {
    permissions.push("Manage Webhooks");
  }
  if (usuario.hasPermission("MANAGE_MESSAGES")) {
    permissions.push("Manage Messages");
  }
  if (usuario.hasPermission("MENTION_EVERYONE")) {
    permissions.push("Mention Everyone");
  }
  if (usuario.hasPermission("MUTE_MEMBERS")) {
    permissions.push("Mute Members");
  }
  if (usuario.hasPermission("DEAFEN_MEMBERS")) {
    permissions.push("Deafen Members");
  }
  if (permissions.length == 0) {
    permissions.push("None");
  }
  const embed = new client.Discord.MessageEmbed()
    .setColor(color[usuario.presence.status])
    .setDescription(`Informacion del usuario ${usuario.user.username}`)
    .setThumbnail(usuario.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setAuthor(
      usuario.user.tag,
      usuario.user.displayAvatarURL({ dynamic: true })
    )
    .addField("「:bust_in_silhouette: 」Nombre", usuario.user.tag, true)
    .addField("「:inbox_tray:」Estado", estados[usuario.presence.status], true);
  if (usuario.presence.activities.name) {
    embed.addField(
      "「:video_game:」Actividad",
      usuario.presence.activities.name,
      true
    );
  }
  embed
    .addField("「:id:」ID", usuario.id, true)
    .addField(
      "「:new:」Cuenta Creada",
      usuario.user.createdAt.toDateString(),
      true
    )
    .addField("「:calendar:」Ingresó", usuario.joinedAt.toDateString(), true);
  if (usuario.nickname !== null) {
    embed.addField("「:page_facing_up:」Apodo", usuario.nickname, true);
  }
  embed.addField(
    "「:game_die:」Roles (" + usuario.roles.cache.size + ")",
    usuario.roles.cache.map((m) => m).join(", ")
  );
  embed.addField(
    "「:gear:」Permisos",
    "```prolog\n" + permissions.join(", ") + "```"
  );
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
