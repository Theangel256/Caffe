const Zeew = require("zeew");
const guildSystem = require("../models/guilds");
const { MessageAttachment, EmbedBuilder } = require("discord.js");
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
  const { channelLogs, goodbyeBackground, channelGoodbye } = dbMsgModel;
  const canal = client.channels.resolve(channelLogs);
  const robot = { true: "Si", false: "No" };
  const logEmbed = new EmbedBuilder()
    .setTitle("**「:x:」 • Miembro Dejado**")
    .setColor("RED")
    .setDescription("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬")
    .setFooter(
      `ID: ${member.user.id}`,
      client.user.displayAvatarURL({ dynamic: true })
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
  const attachment = new MessageAttachment(img, "img.gif");
  const goodbye = client.channels.resolve(channelGoodbye);
  if (goodbye) return goodbye.send(attachment);
};
