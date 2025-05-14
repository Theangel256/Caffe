const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dbConnect = require('./utils/db.js');
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
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
await dbConnect();
require('./utils/passport.js').run(client);
require('./utils/handlers.js').run(client);
process.on('unhandledRejection', function (err) {
    throw err;
});

process.on('uncaughtException', function (err) {
   console.log(err);
});

client.login().catch(err => console.error("Client Login Error: " + err.message));