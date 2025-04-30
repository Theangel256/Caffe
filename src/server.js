const { Client, Collection, GatewayIntentBits} = require('discord.js');
const mongoose = require('mongoose');
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: { parse: ['users'], repliedUser: false },
});
client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Collection();
client.queue = new Collection();
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

client.login().catch(err => console.error("Client Login Error: " + err.message));