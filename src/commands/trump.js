import { AttachmentBuilder, PermissionsBitField } from "discord.js";
import Jimp from "jimp";
export async function run(client, message, args) {
  if (!args[0]) return message.channel.send("Pon algo");
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  const meme = await Jimp.read(
    "https://www.nicepng.com/png/detail/436-4362490_trump-clipart-thumbs-up-transparent-png-stickpng-trump.png"
  );

  const realtext = getWellText(args.slice(0).join(" "), 14, 88);

  meme.rotate(7);

  meme.print(font, 670, 320, realtext, 260);

  meme.rotate(-7, false);

  meme.autocrop();

  const render = await meme.getBufferAsync(Jimp.MIME_PNG);

  const attachment = new AttachmentBuilder(render, "trump.png");

  await message.channel.send(attachment);
};
export const help = {
  name: "trump",
  aliases: [],
  description: "nueva regla de trump!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.AttachFiles],
  ownerOnly: false,
};
/**
 * @param {String} text
 * @param {Number} maxWordLength
 * @param {Number} maxTextLength
 * @returns {String} El texto a imprimir
 */
function getWellText(text, maxWordLength, maxTextLength = Infinity) {
  let realtext = "",
    post_text = "";

  for (let i = 0; i < text.length; i++) {
    if (realtext.length > maxTextLength) break;

    post_text += text[i];

    if (text[i] === " ") {
      post_text = " ";

      realtext += text[i];

      continue;
    }

    if (post_text.length > maxWordLength) {
      realtext += " " + text[i];

      post_text = " ";
    } else {
      realtext += text[i];
    }
  }

  return realtext;
}
