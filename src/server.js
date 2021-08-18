const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] ,
  disableMentions: "everyone",
  fetchAllMembers: true,
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.limits = new Map();
client.queue = new Map();
client.Discord = Discord;
require("./connection");
require("./handlers").run(client);
require("./passport").run(client);
client.login().catch((err) => console.error(err.message));
