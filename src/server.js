const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES],
    disableMentions: 'everyone',
    fetchAllMembers: true,
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.limits = new Discord.Collection();
client.queue = new Discord.Collection();
client.Discord = Discord;
mongoose.connect(process.env.mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) throw err;
        console.log('Connected to MongoDB');
    });
require('./passport.js').run(client);
require('./handlers.js').run(client);
client.login().catch(err => console.error(err.message));