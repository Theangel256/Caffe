const guildSystem = require("../utils/models/guilds");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { getOrCreateDB } = require('../utils/functions.js');
const Zeew = require("zeew");
export default async (client, member) => {
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: member.guild.id });
  const { channelLogs, rolauto, channelWelcome, welcomeBackground } = guildsDB;
  const canal = client.channels.resolve(channelLogs);
  const robot = { true: "Si", false: "No" };
  const logEmbed = new EmbedBuilder()
    .setTitle("**「:white_check_mark:」 • Miembro Unido**")
    .setColor("BLUE")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setFooter(
      `ID: ${member.user.id}`,
      member.user.displayAvatarURL({ extension: "webp"})
    )
    .setTimestamp()
    .addField("**「:boy: 」• Nombre**", member.user.username, true)
    .addField(
      "**「:family_wwg:」• Total de miembros**",
      member.guild.members.cache.filter((x) => !x.user.bot).size,
      true
    )
    .addField(
      "**「:calendar:」• Creado el**",
      member.user.createdAt.toDateString(),
      true
    )
    .addField("**「:robot:」• Bot?**", robot[member.user.bot], true);
  if (canal) return canal.send(logEmbed);
  try {
    if (rolauto) member.roles.add(rolauto);
  } catch (e) {
    new Error("Missing Permissions");
  }

  const fondo = welcomeBackground.exists()
    ? welcomeBackground
    : "https://i.imgur.com/yS9KGBK.jpg";
  const wel = new Zeew.Bienvenida()
    .token("607cd872697aa7ff1648578e")
    .estilo("classic")
    .avatar(member.user.displayAvatarURL({ format: "png" }))
    .fondo(fondo)
    .colorTit("#FF3DB0")
    .titulo("Bienvenid@")
    .colorDesc("#fff")
    .descripcion("Tenemos un nuevo usuario");
  const img = await Zeew.WelcomeZeew(wel);
  const attachment = new AttachmentBuilder(img, "img.gif");
  const welcome = client.channels.resolve(channelWelcome);
  if (welcome) return welcome.send(attachment);
};
