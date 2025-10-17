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
// Usa un puerto dinámico para Render o 4321 localmente
const PORT = process.env.PORT || 4321;
// Lanza Astro Preview sin bloquear el proceso principal
const astro = spawn("npx", ["astro", "preview", "--port", PORT], {
  stdio: "inherit",
  shell: true,
});
// Render necesita que haya un servidor escuchando para detectar el servicio
const keepAlive = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Caffe Bot + Astro server running.\n");
});

// Escucha el mismo puerto (Render escanea puertos)
keepAlive.listen(PORT, () => {
  console.log(`🌐 Listening on port ${PORT}`);
});

// Manejamos errores del proceso Astro
astro.on("close", (code) => {
  console.log(`⚠️ Astro preview exited with code ${code}`);
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
