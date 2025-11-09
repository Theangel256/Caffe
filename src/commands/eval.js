export async function run(client, message, args) {
  const limit = 1950;
  try {
    const code = args.join(" ");
    let evalued = eval(code);
    if (typeof evalued !== "string") {
      evalued = require("util").inspect(evalued);
    }
    const txt = "" + evalued;
    if (txt.length > limit)
      message.channel.send(WriteCode(txt.slice(0, limit), client), {
        code: "js",
      });
    else message.channel.send(WriteCode(txt, client), { code: "js" });
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`js\n${err}\n\`\`\``);
  }
};
export const help = {
  name: "eval",
  aliases: ["e"],
  description: "Solo Desarrolladores!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: true,
};

function WriteCode(code, bot) {
  let tokens = [bot.token];
  tokens = tokens.filter(Boolean);
  const cancellationToken = new RegExp(tokens.join("|"), "gi");
  return code.replace(cancellationToken, ">.> <.<");
}
