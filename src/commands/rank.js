const levels = require("../models/levels");
const Canvas = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const { getMember, getRank } = require("../functions.js");
Canvas.registerFont("Arial.ttf", { family: "Arial" });
module.exports.run = async (client, message, args) => {
  const member = getMember(message, args, true);
  if (member.user.bot)
    return message.channel.send("los bots no tienen niveles");
  const msgDocument = await levels
    .findOne({
      guildID: message.guild.id,
      userID: member.user.id,
    })
    .catch((err) => console.log(err));
  if (!msgDocument) {
    try {
      const dbMsg = await new levels({
        guildID: message.guild.id,
        userID: member.user.id,
        xp: 1,
        lvl: 1,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const usuarios = await getRank(await levels.find(), message);
  let rank = usuarios.findIndex((u) => u[0] == member.user.tag);
  if (rank === -1) rank = `#${usuarios.length}`;
  else rank = `#${rank + 1}`;
  const { lvl, xp } = dbMsgModel;
  const canvas = Canvas.createCanvas(934, 282, "png");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, 934, 282);
  const fondo = await Canvas.loadImage("https://i.imgur.com/fM93m9e.png");
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "webp"}));
  ctx.drawImage(fondo, 10, 10, 914, 262);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#000000";
  ctx.fillRect(216, 150, 650, 60);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeRect(216, 150, 650, 60);
  ctx.stroke();

  ctx.fillStyle = "#7289DA";
  ctx.globalAlpha = 0.5;
  ctx.fillRect(216, 150, (100 / (lvl * 80)) * xp * 6.5, 60);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`${xp} / ${lvl * 80} XP`, 750, 140);

  ctx.font = "25px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("RANK", 580, 70);

  ctx.font = "50px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(rank, 670, 70);

  ctx.font = "25px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("LEVEL", 770, 70);

  ctx.font = "50px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(lvl, 850, 70);

  ctx.font = "25px Arial";
  ctx.textAlign = "left";
  ctx.fillText(member.user.tag, 220, 140);

  ctx.arc(125, 125, 85, 0, Math.PI * 2, true);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 25, 25, 200, 200);
  const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "rankcard.png" });

  message.channel.send({ files: [attachment]});
};
module.exports.help = {
  name: "rank",
  description: "Muestra una carta con todos los datos de tu nivel",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: ["ATTACH_FILES"],
  ownerOnly: false,
};
