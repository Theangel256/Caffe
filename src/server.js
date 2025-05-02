const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require('mongoose');
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    allowedMentions: { parse: ['users'], repliedUser: false },
});
client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Collection();
client.queue = new Collection();
try {
    mongoose.connect(process.env.mongoDB_URI);
    console.log("Connected to Database Successfully");
} catch (error) {
    handleError('Could not Connect to Database:', error.message);
};
require('./passport.js').run(client);
require('./handlers.js').run(client);
process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
   console.log(err);
});

client.login().catch(err => console.error("Client Login Error: " + err.message));