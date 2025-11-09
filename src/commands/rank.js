import levelSystem from "../utils/models/levels.js";
import Canvas from "canvas";
import { AttachmentBuilder, PermissionsBitField } from "discord.js";
import { getMember, getRank, getOrCreateDB } from "../utils/functions.js";
Canvas.registerFont("Arial.ttf", { family: "Arial" });
export async function run(client, message, args, lang) {
  const member = getMember(message, args, true);
  if (member.user.bot)
    return message.channel.send("los bots no tienen niveles");
  const levels = await getOrCreateDB(levelSystem, { guildID: message.guild.id, userID: message.author.id });
  if(!levels) return message.channel.send(lang.dbError)
  const { xp, lvl } = levels;
  const usuarios = await getRank(await levelSystem.find(), message);
  let rank = usuarios.findIndex((u) => u[0] == member.user.tag);
  if (rank === -1) rank = `#${usuarios.length}`;
  else rank = `#${rank + 1}`;
  const canvas = Canvas.createCanvas(934, 282, "png");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, 934, 282);
  const fondo = await Canvas.loadImage("https://i.imgur.com/fM93m9e.png");
  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png"}));
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

  ctx.font = "30px Arial";
  ctx.fillStyle = "rgb(130, 136, 214)";
  ctx.fillText("RANK", 590, 70);

  ctx.font = "50px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(rank, 680, 70);

  ctx.font = "30px Arial";
  ctx.fillStyle = "rgb(130, 136, 214)";
  ctx.fillText("LEVEL", 780, 70);

  ctx.font = "50px Arial";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(lvl, 860, 70);

  ctx.font = "35px Arial";
  ctx.textAlign = "left";
  ctx.fillText(member.user.username, 230, 130);

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
export const help = {
  name: "rank",
  description: "Muestra una carta con todos los datos de tu nivel",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.AttachFiles],
  ownerOnly: false,
};
