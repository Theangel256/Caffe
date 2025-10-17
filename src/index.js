require('dotenv').config();
const { ShardingManager } = require('discord.js');
const { spawn } = require('child_process');

async function start() {
  // Crear el ShardingManager
  const manager = new ShardingManager(`${__dirname}/shard.js`, {
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

const astro = spawn("npx", ["astro", "preview", "--port", process.env.PORT || "10000"], {
  stdio: "inherit",
  shell: true,
});
astro.on("exit", (code) => {
  console.log(`Astro preview exited with code ${code}`);
});
  // Levantamos todos los shards automáticamente
  manager.spawn();
  // Eventos de los shards
  manager.on('shardCreate', shard => {
    shard.on('ready', () => console.log(`❖ Shard ${shard.id} launched!`));
    shard.on('error', error => console.error(`❖ Shard ${shard.id} error:`, error));
  });
}

// Ejecutar el inicio
start();
