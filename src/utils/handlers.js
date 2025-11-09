import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Reemplaza __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '../..');

// Rutas
const cmdPath = join(__dirname, 'commands');
const eventPath = join(__dirname, 'events');

export async function loadCommands(client) {
  client.commands = new Collection();
  client.aliases = new Collection();

  const commandFiles = readdirSync(cmdPath)
    .filter(file => file.endsWith('.js'))
    .filter(file => !file.startsWith('.')); // Ignora .DS_Store, etc.

  for (const file of commandFiles) {
    const filePath = join(cmdPath, file);
    const url = new URL(`file://${filePath}`).href;
    // @vite-ignore
    const command = await import(url);

    if (command.help?.name) {
      client.commands.set(command.help.name, command);
      console.log(`[CMD] Cargado: ${command.help.name}`);

      if (command.help.aliases) {
        for (const alias of command.help.aliases) {
          client.aliases.set(alias, command);
        }
      }
    }
  }
}
export async function loadEvents(client) {
  const files = readdirSync(eventPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = join(eventPath, file);
    const url = new URL(`file://${filePath}`).href;
    // @vite-ignore
    const eventModule = await import(url);

    const event = eventModule.default || eventModule;
    const eventName = file.split('.').shift();

    // VERIFICA QUE SEA FUNCIÓN
    if (typeof event !== 'function') {
      console.warn(`[EVENT] ${eventName} no exporta una función`);
      continue;
    }

    client.on(eventName, event.bind(null, client));
    console.log(`[EVENT] Cargado: ${eventName}`);
  }
}

// Carga automática
export async function loadHandlers(client) {
  await loadCommands(client);
  await loadEvents(client);
}