require('dotenv').config();
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(`${__dirname}/server.js`);

manager.spawn('auto');

manager.on('ShardCreate', shard => console.log(`Shard ${shard.id} launched`));