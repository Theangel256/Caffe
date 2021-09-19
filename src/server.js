const Discord = require("discord.js");
const mongoose = require("mongoose");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
  disableMentions: "everyone",
  fetchAllMembers: true,
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.limits = new Map();
client.queue = new Map();
client.Discord = Discord;
mongoose.connect(
  process.env.mongoDB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log(db.connection.host);
  }
);
require("./connection");
require("./handlers").run(client);
require("./passport").run(client);
client.login().catch((err) => console.error(err.message));
