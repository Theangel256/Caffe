module.exports.run = (client, message) => {
  const guild = message.guild,
    features = {
      ANIMATED_ICON: "Icono animado",
      BANNER: "Banner de servidor",
      COMMERCE: "Canal de tienda",
      DISCOVERABLE: "Servidor de Discord Discovery List",
      FEATURABLE: "Apto para estar en la lista de destacados",
      INVITE_SPLASH: "Fondo para invitaciones",
      PUBLIC: "El servidor es público",
      NEWS: "Canal de novedades",
      PARTNERED: "Servidor Asociado",
      VANITY_URL: "Invitacion personalizada",
      VERIFIED: "Servidor verificado",
      VIP_REGIONS: "Región V.I.P",
    },
    nivel = {
      0: "Ninguno",
      1: "Nivel 1",
      2: "Nivel 2",
      3: "Nivel 3",
    },
    verifLevels = {
      NONE: "Ningúno",
      LOW: "Bajo",
      MEDIUM: "Medio",
      HIGH: "(╯°□°）╯︵  ┻━┻",
      VERY_HIGH: "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻",
    },
    region = {
      europe: "Europa :flag_eu:",
      brazil: "Brasil :flag_br: ",
      hongkong: "Hong Kong :flag_hk:",
      japan: "Japón :flag_jp:",
      russia: "Rusia :flag_ru:",
      singapore: "Singapur :flag_sg:",
      southafrica: "Sudáfrica :flag_za:",
      sydney: "Sydney :flag_au:",
      "us-central": "Central US :flag_us:",
      "us-east": "Este US :flag_us:",
      "us-south": "Sur US :flag_us:",
      "us-west": "Oeste US :flag_us:",
      "vip-us-east": "VIP US Este :flag_us:",
      "eu-central": "Europa Central :flag_eu:",
      "eu-west": "Europa Oeste :flag_eu:",
      london: "London :flag_gb:",
      amsterdam: "Amsterdam :flag_nl:",
      india: "India :flag_in:",
    },
    embed = new client.Discord.MessageEmbed()
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .addField("_Dueño del Servidor_", guild.owner.user.tag, true)
      .addField("_ID_", guild.id, true)
      .addField("_Region_", region[guild.region], true)
      .addField("_Miembros_", guild.memberCount.toLocaleString(), true)
      .addField(
        "_Bots_",
        guild.members.cache.filter((member) => member.user.bot).size,
        true
      )
      .addField("_Roles_", guild.roles.cache.size, true)
      .addField(
        "_Nivel de verificación_",
        verifLevels[guild.verificationLevel],
        true
      )
      .addField("_Nivel de Boost_", nivel[guild.premiumTier], true)
      .addField(
        "_Miembros boosteando_",
        guild.premiumSubscriptionCount === 0
          ? "Sin boosts"
          : `${guild.premiumSubscriptionCount} ${
              guild.bscriptionCount === 1 ? "miembro" : "miembros"
            }`,
        true
      )
      .addField(
        "_Ventajas del servidor_",
        guild.features.length <= 0
          ? "Ninguna"
          : `${guild.features
              .filter((x) => features[x] === features["NEWS"])
              .map((f) => features[f])
              .join("`, `")}`,
        true
      )
      .setThumbnail(
        !guild.splashURL({ size: 2048, format: "jpg" })
          ? guild.iconURL({ size: 2048, format: "jpg" })
          : guild.splashURL({ size: 2048, format: "jpg" })
      )
      .setDescription(
        `_creado el_ **_${guild.createdAt.toDateString().split(" ")[2]}/${
          guild.createdAt.toDateString().split(" ")[1]
        }/${guild.createdAt.toDateString().split(" ")[3]}_**`
      )
      .setImage(guild.bannerURL({ size: 2048, format: "jpg" }))
      .setTimestamp()
      .setColor(0x00ffff);
  message.channel.send(embed);
};
module.exports.help = {
  name: "server-info",
  aliases: ["server", "guild"],
  description: "Muestra toda la informacion del servidor!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
