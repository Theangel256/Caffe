const { PermissionsBitField } = require("discord.js");

module.exports.run = async (client, message, args) => {
  if (!args[0] || isNaN(args[0]))
    return message.channel.send(client.lang.commands.clear.no_args);

  const number = parseInt(args[0]);
  if (number < 1 || number > 100)
    return message.channel.send(client.lang.commands.clear.invalid_number);

  await message.delete().catch(() => {});

  const messages = await message.channel.messages.fetch({ limit: number });

  const filter = (msg) => {
    const ids = message.mentions.users.map(u => u.id);
    const hasMentions = ids.length > 0;

    const hasBots = args.includes("bot") || args.includes("bots");
    const hasAttachments = args.includes("attachment") || args.includes("attachments");
    const hasEmbeds = args.includes("embed") || args.includes("embeds");

    const textIndex = args.findIndex(a => a.toLowerCase() === "with");
    const textToMatch = textIndex !== -1 ? args.slice(textIndex + 1).join(" ") : null;

    return (
      (!hasMentions || ids.includes(msg.author.id)) &&
      (!hasBots || msg.author.bot) &&
      (!hasAttachments || msg.attachments.size > 0) &&
      (!hasEmbeds || msg.embeds.length > 0) &&
      (!textToMatch || msg.content.toLowerCase().includes(textToMatch.toLowerCase()))
    );
  };
  const filtered = messages.filter(filter);

  const deleted = await message.channel.bulkDelete(filtered, true).catch(() => null);

  if (!deleted || deleted.size === 0) {
    return message.channel.send(client.lang.commands.clear.no_messages);
  }

  const confirm = await message.channel.send(client.lang.commands.clear.cleared.replace(/{number}/gi, deleted.size));
  setTimeout(() => confirm.delete().catch(() => {}), 5000);

};

module.exports.help = {
  name: "clear",
  description: "Deletes messages from the current channel, with filters.\n\n**Usage:**\n`$clear <amount> [filters]`\n\n**Filters:**\n`bot` - Deletes only messages from bots.\n`attachment` - Deletes only messages with attachments.\n`embed` - Deletes only messages with embeds.\n`with <text>` - Deletes only messages that contain the specified text.",
  aliases: ["purge", "prune", "bulkdelete"],
};

module.exports.requirements = {
  userPerms: [PermissionsBitField.Flags.ManageMessages],
  clientPerms: [PermissionsBitField.Flags.ManageMessages],
  ownerOnly: false,
};
