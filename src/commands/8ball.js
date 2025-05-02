const { EmbedBuilder, PermissionsBitField } = require("discord.js");
module.exports.run = (client, message, args) => {
  const lang = client.lang.commands.eightBall;
  const pregunta = args.join(" ");
  const result = Math.floor(Math.random() * lang.ball.length);
  const embed = {
    color: 0x00ffff,
    title: lang.title,
    fields: [
      { name: lang.field1, value: `${pregunta}` },
      { name: lang.field2, value: lang.ball[result] },
    ],
  };
  if (!pregunta[0]) return message.channel.send(lang.no_args);
  message.channel.send({ embeds: [embed] });
};
module.exports.help = {
  name: "8ball",
  description: "Preguntale algo a Caffedivinius",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.EmbedLinks,
  ],
  ownerOnly: false,
};
module.exports.limits = {
  rateLimit: 3,
  cooldown: 20000,
};
