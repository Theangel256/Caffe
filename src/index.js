require("dotenv").config();
const { ShardingManager } = require("discord.js");
const { spawn } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

// Puerto asignado por Render
const PORT = process.env.PORT || 10000;

// Configurar ShardingManager
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

// Función para iniciar el servidor Astro (producción)
function startAstro() {
  console.log(`🚀 Iniciando servidor Astro en puerto ${PORT}...`);

  // Ruta al entrypoint del servidor SSR
  const serverPath = path.join(__dirname, "dist", "server", "entry.mjs");

  if (!existsSync(serverPath)) {
    console.error("❌ No se encontró dist/server/entry.mjs");
    process.exit(1);
  }

  const astro = spawn("node", [serverPath], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: PORT.toString(),
      HOST: "0.0.0.0", // Escuchar en todas las interfaces
    },
  });

  astro.on("close", (code) => {
    console.log(`⚠️ Servidor Astro cerrado con código ${code}`);
    process.exit(code);
  });
}

// Construir Astro si no existe /dist
if (!existsSync("./dist")) {
  console.log("⚙️ No se encontró build, ejecutando astro build...");
  const build = spawn("npx", ["astro", "build"], { stdio: "inherit" });

  build.on("close", (code) => {
    if (code === 0) {
      startAstro();
      setTimeout(startBot, 8000);
    } else {
      console.error(`❌ Falló astro build (código ${code})`);
      process.exit(1);
    }
  });
} else {
  startAstro();
  setTimeout(startBot, 5000);
}