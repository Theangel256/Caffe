const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: { parse: ['users'], repliedUser: false },
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.limits = new Discord.Collection();
client.queue = new Discord.Collection();
client.Discord = Discord;
mongoose.connect(process.env.mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    (err) => {
    if (err) throw err;
        console.log('Connected to MongoDB');
    });
require('./passport.js').run(client);
require('./handlers.js').run(client);
process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
   console.log(err);
});

client.login().catch(err => console.error("Lol " + err.message));