require('dotenv').config();
const { ShardingManager } = require('discord.js');
const { spawn } = require('child_process');
const http = require('http');

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

const astro = spawn("npx", ["astro", "preview"], {
  stdio: "inherit",
  shell: true,
});
astro.on("exit", (code) => {
  console.log(`Astro preview exited with code ${code}`);
});
const PORT = process.env.PORT || 4321;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("✅ Caffe bot + Astro server running\n");
  })
  .listen(PORT, () => {
    console.log(`🌐 Listening on port ${PORT}`);
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
