const { getMember } = require("../functions");
const Canvas = require("canvas");
module.exports.run = async (client, message, args) => {
  const member = getMember(message, args, false);
  if (!member) return message.channel.send(client.lang.no_user);

  const canvas = Canvas.createCanvas(1080, 970);
  const ctx = canvas.getContext("2d");

  const fondo = await Canvas.loadImage("https://i.imgur.com/j5gNEmh.jpg");
  ctx.drawImage(fondo, 10, 10, 1080, 970);
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "png" })
  );
  ctx.drawImage(avatar, 570, 10, 515, 460);
  const avatar1 = await Canvas.loadImage(
    message.author.displayAvatarURL({ format: "png" })
  );
  ctx.drawImage(avatar1, 570, 465, 515, 510);
  const attachment = new client.Discord.MessageAttachment(
    canvas.toBuffer(),
    "rankcard.png"
  );
  message.channel.send(attachment);
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
