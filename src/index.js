require("dotenv").config();
const { ShardingManager } = require("discord.js");
const { spawn } = require("child_process");
const { existsSync } = require("fs");
const http = require("http");

const PORT = process.env.PORT || 4321;

/* Servidor HTTP mínimo (Render necesita un puerto abierto)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Caffe Bot + Astro server running.\n");
});
server.listen(PORT, () => console.log(`🌐 Listening on port ${PORT}`));
*/

// Configurar el ShardingManager
const manager = new ShardingManager(`${__dirname}/shard.js`, {
  token: process.env.DISCORD_TOKEN,
  totalShards: "auto",
  shardArgs: [
    "--max-old-space-size=2048",
    "--unhandled-rejections=strict",
    "--no-deprecation",
    "--trace-warnings",
  ],
});

// Función para iniciar el bot
function startBot() {
  console.log("🤖 Iniciando shards de Discord...");
  manager.spawn();
  manager.on("shardCreate", (shard) => {
    console.log(`❖ Shard ${shard.id} creado`);
    shard.on("ready", () => console.log(`✅ Shard ${shard.id} listo`));
    shard.on("error", (err) =>
      console.error(`❌ Error en shard ${shard.id}:`, err)
    );
  });
}

// Función para lanzar Astro
function startAstro() {
  console.log("🚀 Iniciando servidor Astro...");
  const astro = spawn("npx", ["astro", "preview", "--port", PORT], {
    stdio: "inherit",
  });

  astro.on("close", (code) => {
    console.log(`⚠️ Astro preview salió con código ${code}`);
  });
}
  // Si no hay build, lo genera
  if (!existsSync("./dist")) {
    console.log("⚙️ No se encontró el build de Astro, ejecutando astro build...");
    const build = spawn("npx", ["astro", "build"], { stdio: "inherit" });
    build.on("close", (code) => {
      if (code === 0) {
        startAstro();
        setTimeout(startBot, 8000); // Espera unos segundos antes de lanzar el bot
      } else {
        console.error(`❌ Error al ejecutar astro build (código ${code})`);
      }
    });
  } else {
    startAstro();
    setTimeout(startBot, 5000); // Espera 5 s para evitar conflicto de puertos
  }