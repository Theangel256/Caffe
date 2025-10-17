const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const dbConnect = require('./utils/db.js');

async function start() {
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

  await dbConnect();

  require('./utils/handlers.js').run(client);
  
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
    });
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
    });

  client.login().catch(err => console.error("Client Login Error: " + err.message));
}

start(); // Calling the async function

module.exports = client;