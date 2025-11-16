import { ComponentType } from 'discord.js';
import { cp } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export async function copyAssets() {
  const srcFolders = ['commands', 'events'];
  const baseSrc = join(__dirname, '..', 'src');
  const baseDist = join(__dirname, '..', 'dist');

  for (const folder of srcFolders) {
    const src = join(baseSrc, folder);
    const dist = join(baseDist, folder);
    try {
      await cp(src, dist, { recursive: true });
      console.log(`Copied ${folder}/ → ${dist}`);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      console.warn(`No ${folder} folder to copy`);
    }
  }
}

copyAssets();