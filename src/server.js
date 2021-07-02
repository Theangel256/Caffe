const Discord = require("discord.js");
const client = new Discord.Client({
  ws: { intents: 32767 },
  disableMentions: "everyone",
  fetchAllMembers: true,
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.limits = new Map();
client.queue = new Map();
client.Discord = Discord;
require("./structures/connection");
require("./structures/handler").run(client);
require("./structures/passport").run(client);
client.login().catch((err) => console.error(err.message));
