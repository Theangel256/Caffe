const { getMember } = require("../utils/functions.js");
const Canvas = require("canvas");
const { AttachmentBuilder } = require("discord.js");
module.exports.run = async (client, message, args) => {
  const member = getMember(message, args, false);
  if (!member) return message.channel.send(client.lang.no_user);

  const canvas = Canvas.createCanvas(1080, 970);
  const ctx = canvas.getContext("2d");

  const fondo = await Canvas.loadImage("https://i.imgur.com/j5gNEmh.jpg");
  ctx.drawImage(fondo, 10, 10, 1080, 970);
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ extension: "webp"})
  );
  ctx.drawImage(avatar, 570, 10, 515, 460);
  const avatar1 = await Canvas.loadImage(
    message.author.displayAvatarURL({ extension: "webp"})
  );
  ctx.drawImage(avatar1, 570, 465, 515, 510);
  const attachment = new AttachmentBuilder(
    canvas.toBuffer(), 
    { name: "drake.png" }
  );
  message.channel.send({ files: [attachment] });
};
module.exports.help = {
  name: "drake",
  description:
    "Usa este comando para decidir quien acepta el rapero drake o quien no!",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["ATTACH_FILES"],
  ownerOnly: false,
};