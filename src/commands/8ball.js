import { PermissionsBitField } from "discord.js";

export function run(client, message, args, lang) {
  lang = lang.commands.eightBall;
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

export const help = {
  name: "8ball",
  description: "Preguntale algo a Caffedivinius",
};
export const requirements = {
  userPerms: [],
  clientPerms: [
    PermissionsBitField.Flags.EmbedLinks,
  ],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 3,
  cooldown: 20000,
};
