import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { join } from 'path';
import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir   = join(currentFile, '..');           // folder of this file
const serverRoot   = join(currentDir, '..');            // src/server  or  dist/server

const cmdPath   = join(serverRoot, 'commands');
const eventPath = join(serverRoot, 'events');

export async function loadCommands(client) {
  client.commands = new Collection();
  client.aliases   = new Collection();

  let commandFiles = [];
  try {
    commandFiles = readdirSync(cmdPath)
      .filter(f => f.endsWith('.js'))
      .filter(f => !f.startsWith('.'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[CMDS] Folder not found: ${cmdPath}`);
      console.warn('[CMDS]   → Run the copy-commands build step or add the folder.');
    } else {
      throw err;
    }
  }

  for (const file of commandFiles) {
    const filePath = join(cmdPath, file);
    // `file://` URL works with dynamic import in both Node & Vite-built chunks
    const url = new URL(`file://${filePath}`).href;
    // @vite-ignore
    const command = await import(url);

    if (command.help?.name) {
      client.commands.set(command.help.name, command);

      if (Array.isArray(command.help.aliases)) {
        for (const alias of command.help.aliases) {
          client.aliases.set(alias, command);
        }
      }
    }
  }
  console.log(`[CMDS] Loaded: ${commandFiles.length}`);
}
export async function loadEvents(client) {
  let files = [];
  try {
    files = readdirSync(eventPath).filter(f => f.endsWith('.js'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[EVENTS] Folder not found: ${eventPath}`);
    } else {
      throw err;
    }
  }

  for (const file of files) {
    const filePath = join(eventPath, file);
    const url = new URL(`file://${filePath}`).href;
    // @vite-ignore
    const eventModule = await import(url);

    const event = eventModule.default || eventModule;
    const eventName = file.split('.').shift();

    if (typeof event !== 'function') {
      console.warn(`[EVENT] ${eventName} does not export a function`);
      continue;
    }

    client.on(eventName, event.bind(null, client));
  }
  console.log(`[EVENTS] Loaded: ${files.length}`);
}

export async function loadHandlers(client) {
  await loadCommands(client);
  await loadEvents(client);
}