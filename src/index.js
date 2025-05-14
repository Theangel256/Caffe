require('dotenv').config();
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager(`${__dirname}/server.js`, {
    token: process.env.DISCORD_TOKEN,
    totalShards: 'auto',
    shardArgs: [
        '--max-old-space-size=2048',
        '--unhandled-rejections=strict',
        '--unhandled-rejection=throw',
        '--no-deprecation',
        '--trace-warnings',
    ],
});
manager.spawn('auto');
manager.on('shardCreate', async (shard) => {
    shard.on('ready', () => {
        console.log(`❖  Shard ${shard.id} Launched`)
    })
    shard.on('error', (error) => {
       console.error(`Shard ${shard.id} encountered an error: ${error}`)
    })
});
