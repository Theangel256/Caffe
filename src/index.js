require('dotenv').config();
const { ShardingManager } = require('discord.js');
const { spawn } = require('child_process');
const { existsSync } = require("fs");
const path = require("path");
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
// Usa un puerto dinámico para Render o 4321 localmente
const PORT = process.env.PORT || 4321;
// Render necesita que haya un servidor escuchando para detectar el servicio
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Caffe Bot + Astro server running.\n");
});
server.listen(PORT, () => {
  console.log(`🌐 Listening on port ${PORT}`);
});
if (!existsSync("./dist")) {
  console.log("⚙️ No se encontró el build de Astro, ejecutando astro build...");
  const build = spawn("npx", ["astro", "build"], { stdio: "inherit" });
  build.on("close", (code) => {
    if (code === 0) startAstro();
    else console.error(`❌ Error al ejecutar astro build (código ${code})`);
  });
} else { startAstro(); }

  // Levantamos todos los shards automáticamente
  manager.spawn();
  // Eventos de los shards
  manager.on('shardCreate', shard => {
    shard.on('ready', () => console.log(`❖  Shard ${shard.id} launched!`));
    shard.on('error', error => console.error(`❖ Shard ${shard.id} error:`, error));
  });
}

// Ejecutar el inicio
start();


function startAstro() {
  console.log("🚀 Iniciando servidor Astro...");
  const astro = spawn("npx", ["astro", "preview", "--port", PORT], {
    stdio: "inherit",
  });

  astro.on("close", (code) => {
    console.log(`⚠️ Astro preview exited with code ${code}`);
  });
}