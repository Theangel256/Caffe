import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { join } from 'path';
import { fileURLToPath } from 'url';

// Reemplaza __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

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
    // @vite-ignore
    const filePath = new URL(file, `file://${cmdPath}/`).href;
    const command = await import(filePath);

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
  const eventFiles = readdirSync(eventPath)
    .filter(file => file.endsWith('.js'))
    .filter(file => !file.startsWith('.'));

  for (const file of eventFiles) {
    // @vite-ignore
    const filePath = new URL(file, `file://${eventPath}/`).href;
    const event = await import(filePath);

    const eventName = file.split('.').shift();
    client.on(eventName, event.bind(null, client));
    console.log(`[EVENT] Cargado: ${eventName}`);
  }
}

// Carga automática
export async function loadHandlers(client) {
  await loadCommands(client);
  await loadEvents(client);
}