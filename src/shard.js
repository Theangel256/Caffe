require('dotenv').config();
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
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  allowedMentions: { parse: ['users'], repliedUser: false },
});

client.commands = new Collection();
client.aliases = new Collection();
client.limits = new Collection();
client.queue = new Collection();

async function startShard() {
  try {
    await dbConnect();
    require('./utils/handlers.js').run(client);

    process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err));
    process.on('uncaughtException', err => console.error('Uncaught Exception:', err));

    client.login().catch(err => console.error("Client Login Error: " + err.message));
    console.log(`✅ Shard running with ${client.guilds.cache.size} guilds`);
  } catch (err) {
    console.error('Error starting shard:', err);
    process.exit(1);
  }
}

startShard();

// Exportamos client para endpoints que lo necesiten
module.exports = client;
