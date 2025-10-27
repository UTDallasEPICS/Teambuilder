import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import getAllFiles from '../utils/getAllFiles';
import { Client } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (client: Client) => {
  const candidateProjectPath = join(process.cwd(), 'server', 'integrations', 'discordBot', 'src', 'events');
  const candidateRelativePath = join(__dirname, '../events');

  let eventsDir: string | null = null;
  if (fs.existsSync(candidateProjectPath)) {
    eventsDir = candidateProjectPath;
  } else if (fs.existsSync(candidateRelativePath)) {
    eventsDir = candidateRelativePath;
  } else {
    console.warn(`[DiscordBot] Events folder not found. Checked:\n  ${candidateProjectPath}\n  ${candidateRelativePath}`);
    return;
  }

  const eventFolders = getAllFiles(eventsDir, true);

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    
    // sort files inside folders so that files with lower numbers get higher priority
    eventFiles.sort((a, b) => (a > b ? 1 : -1));

    // gets the name of the event based on the folder name
    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    if (!eventName) continue; // Ensure eventName is valid

    // support both legacy 'ready' and new 'clientReady' to be future-proof
    const eventNames = eventName === 'ready'
      ? ['clientReady']
      : eventName === 'clientReady'
      ? ['clientReady']
      : [eventName];

    for (const name of eventNames) {
      // listens for events to happen and then calls the required event
      client.on(name as any, async (arg) => {
        for (const eventFile of eventFiles) {
          try {
            let module: any;

          // try direct import first
          try {
            // prefer jiti for TS/ESM runtime loading
            const { default: jiti } = await import('jiti');
            const j = (jiti as any)(import.meta.url);
            module = j(eventFile);
          } catch (e) {
            // final fallback to native dynamic import (for .js files)
            const { pathToFileURL } = await import('url');
            module = await import(pathToFileURL(eventFile).href);
          }

            const eventFunction = module.default;

            if (typeof eventFunction === 'function') {
              await eventFunction(client, arg);
            } else {
              console.error(`Default export in ${eventFile} is not a function`);
            }
          } catch (importErr: any) {
            console.error(`[DiscordBot] Failed to import event file ${eventFile}:`, importErr?.message || importErr);
            console.error(importErr);
          }
        }
      });
    }
  }
};