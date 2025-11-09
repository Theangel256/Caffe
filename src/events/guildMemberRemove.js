const Zeew = require("zeew");
const guildSystem = require("../utils/models/guilds");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { getOrCreateDB } = require('../utils/functions.js');
export default async (client, member) => { 
  const guildsDB = await getOrCreateDB(guildSystem, { guildID: member.guild.id });
  const { channelLogs, goodbyeBackground, channelGoodbye } = guildsDB;
  const canal = client.channels.resolve(channelLogs);
  const robot = { true: "Si", false: "No" };
  const logEmbed = new EmbedBuilder()
    .setTitle("**「:x:」 • Miembro Dejado**")
    .setColor("RED")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setFooter(
      `ID: ${member.user.id}`,
      client.user.displayAvatarURL({ extension: "webp"})
    )
    .setTimestamp()
    .addField("**「:boy: 」• Nombre**", member.user.username, true)
    .addField(
      "**「:family_wwg:」• Total de miembros**",
      member.guild.members.cache.filter((x) => !x.user.bot).size,
      true
    )
    .addField(
      "**「:calendar:」• Unido el**",
      member.joinedAt.toDateString(),
      true
    )
    .addField("**「:robot:」• Bot?**", robot[member.user.bot], true);
  canal.send(logEmbed);
  const fondo = goodbyeBackground.exists()
    ? goodbyeBackground
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
  const goodbye = client.channels.resolve(channelGoodbye);
  if (goodbye) return goodbye.send(attachment);
};
