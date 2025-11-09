import Canvas from "canvas";
import { getMember } from "../utils/functions.js";
import { AttachmentBuilder } from "discord.js";
import { PermissionsBitField } from "discord.js";
export async function run(client, message, args) {
  const member = getMember(message, args, false);
  if (!member) return message.channel.send(client.lang.no_user);

  const canvas = Canvas.createCanvas(1080, 970);
  const ctx = canvas.getContext("2d");

  const fondo = await Canvas.loadImage("https://i.imgur.com/j5gNEmh.jpg");
  ctx.drawImage(fondo, 10, 10, 1080, 970);
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ extension: "png" })
  );
  ctx.drawImage(avatar, 570, 10, 515, 460);
  const avatar1 = await Canvas.loadImage(
    message.author.displayAvatarURL({ extension: "png" })
  );
  ctx.drawImage(avatar1, 570, 465, 515, 510);
  const attachment = new AttachmentBuilder(
    canvas.toBuffer(), 
    { name: "drake.png" }
  );
  message.channel.send({ files: [attachment] });
};
export const help = {
  name: "drake",
  description:
    "Usa este comando para decidir quien acepta el rapero drake o quien no!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.AttachFiles],
  ownerOnly: false,
};