const { missingPerms } = require("../functions");
module.exports.run = async (client, message, args) => {
  if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) {
    return message.reply(
      client.lang.userPerms.replace(
        /{function}/gi,
        missingPerms(client, message.member, ["MANAGE_MESSAGES"])
      )
    );
  }
  if (
    !message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")
  ) {
    return message.reply(
      client.lang.clientPerms.replace(
        /{function}/gi,
        missingPerms(client, message.guild.me, ["MANAGE_MESSAGES"])
      )
    );
  }

  if (!args[0] || (isNaN(args[0]) && !args[1]))
    return message.channel.send(client.lang.commands.clear.no_args);

  const number = args[0];
  if (!isNaN(number) && number <= 100 && number >= 1) {
    await message.delete();
    switch (args[1].toLowerCase()) {
      case "users":
        {
          if (!args[2])
            return message.channel.send({
              coontent:
                "Mention or put the ID of the people whom you want their messages to be deleted.\n`purge users <number> <mentions>`",
            });
          const authors = message.mentions.users.size
            ? message.mentions.users.keyArray()
            : args.slice(2);
          const messages = await message.channel.messages.fetch(
            {
              limit: number,
            },
            false
          );
          messages.sweep((m) => !authors.includes(m.author.id));
          await message.channel.bulkDelete(messages, true);
          const thing = await message.channel.send(
            messages.size + " messages were successfully deleted"
          );
          thing.delete({ timeout: 5000 });
        }
        break;
      case "bots":
        {
          const messages = await message.channel.messages.fetch(
            {
              limit: number,
            },
            false
          );
          messages.sweep((m) => !m.author.bot);
          await message.channel.bulkDelete(messages, true);
          const thing = await message.channel.send(
            messages.size + " messages were successfully deleted"
          );
          thing.delete({ timeout: 5000 });
        }
        break;
      case "attachments":
        {
          const messages = await message.channel.messages.fetch(
            {
              limit: number,
            },
            false
          );
          messages.sweep((m) => !m.attachments.first());
          await message.channel.bulkDelete(messages, true);
          const thing = await message.channel.send(
            messages.size + " messages were successfully deleted"
          );
          thing.delete({ timeout: 5000 });
        }
        break;
      case "embeds":
        {
          const messages = await message.channel.messages.fetch(
            {
              limit: number,
            },
            false
          );
          messages.sweep((m) => !m.embeds[0]);
          await message.channel.bulkDelete(messages, true);
          const thing = await message.channel.send(
            messages.size + " messages were successfully deleted"
          );
          thing.delete({ timeout: 5000 });
        }
        break;
      case "with":
        {
          const messages = await message.channel.messages.fetch(
            {
              limit: number,
            },
            false
          );
          messages.sweep(
            (m) => !new RegExp(args.slice(2).join(" "), "gmi").test(m.content)
          );
          await message.channel.bulkDelete(messages, true);
          const thing = await message.channel.send(
            messages.size + " messages were successfully deleted"
          );
          thing.delete({ timeout: 5000 });
        }
        break;
      default: {
        if (args[2]) return message.channel.send("Invalid mode!");
        await message.channel.bulkDelete(number, true);
      }
    }
  } else if (isNaN(number)) {
    message.channel.send("That isn't a number!");
  } else if (number > 100) {
    message.channel.send("I can only delete 100 messages at a time.");
  } else if (number < 1) {
    message.channel.send("I don't think 0 or less is what you want to delete.");
  }
};
module.exports.help = {
  name: "clear",
  aliases: ["purge", "prune", "bulkdelete"],
  description: "Borra los mensajes de un canal",
};
module.exports.requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
