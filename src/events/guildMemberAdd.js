const guildSystem = require("../models/guilds");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const Zeew = require("zeew");
module.exports = async (client, member) => {
  const msgDocument = await guildSystem
    .findOne({
      guildID: member.guild.id,
    })
    .catch((err) => console.log(err));
  if (!msgDocument) {
    try {
      const dbMsg = await new guildSystem({
        guildID: message.guild.id,
        prefix: process.env.prefix,
        language: "en",
        role: false,
        kick: false,
        ban: false,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const { channelLogs, rolauto, channelWelcome, welcomeBackground } =
    dbMsgModel;
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
