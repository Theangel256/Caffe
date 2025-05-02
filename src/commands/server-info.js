const { EmbedBuilder } = require("discord.js");
module.exports.run = async (client, message) => {
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
    guildOwner = await message.guild.members.fetch(guild.ownerId),
    embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .addFields({
        name: "_Dueño del Servidor_", value: guildOwner, inline: true,
        name: "_ID_", value: guild.id, inline: true,
        name: "_Region_", value: region[guild.region], inline: true,
        name: "_Miembros_", value: guild.memberCount.toLocaleString(), inline: true ,
        name: "_Bots_", value: guild.members.cache.filter((member) => member.user.bot).size.toString(), inline: true,
        name: "_Roles_", value: guild.roles.cache.size, inline: true,
        name: "_Canales_", value: guild.channels.cache.size, inline: true,
        name: "_Emojis_", value: guild.emojis.cache.size, inline: true,
        name: "_Boosts_", value: guild.premiumSubscriptionCount, inline: true, 
        name: "_Nivel de verificación_", value: verifLevels[guild.verificationLevel], inline: true,
        name: "_Boosts Nivel_", value: nivel[guild.premiumTier], inline: true,
        name: "_Miembros boosteando_", value: guild.premiumSubscriptionCount === 0 ? "Sin boosts" : `${guild.premiumSubscriptionCount} ${guild.bscriptionCount === 1 ? "miembro" : "miembros"}`, inline: true,
        name: "_Funciones del servidor_", value: guild.features.length <= 0
          ? "Ninguna"
          : `${guild.features
              .filter((x) => features[x] === features["NEWS"])
              .map((f) => features[f])
              .join("`, `")}`,
        inline: true,
        name: "_Verificado_", value: guild.verified ? "Si" : "No", inline: true,
        name: "_Invitaciones_", value: guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : "No disponible", inline: true,
    
        })
      .setThumbnail(
        !guild.splashURL({ size: 2048, format: "jpg" })
          ? guild.iconURL({ size: 2048, format: "jpg" })
          : guild.splashURL({ size: 2048, format: "jpg" })
      )
      .setDescription(`_Creado el_ **_${guild.createdAt.toDateString().split(" ")[2]}/${guild.createdAt.toDateString().split(" ")[1]}/${guild.createdAt.toDateString().split(" ")[3]}_**`)
      .setImage(guild.bannerURL({ size: 2048, format: "jpg" }))
      .setTimestamp()
      .setColor(0x00ffff);
  message.channel.send({ embeds: [embed] });
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
