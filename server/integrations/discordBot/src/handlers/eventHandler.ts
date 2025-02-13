// This file handles all events within the events folder

import { fileURLToPath, pathToFileURL} from 'url';
import { dirname, join } from 'path';
import getAllFiles from '../utils/getAllFiles';
import { Client } from 'discord.js';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjust the base directory to the project root
const baseDir = join(__dirname, '../../../../../'); // Adjust this based on your project structure

export default (client: Client) => {
  // List of all folders inside the /events folder
  const eventFolders = getAllFiles(join(baseDir, 'server/integrations/discordBot/src/events'), true);

  // Loops through all folders:
  for (const eventFolder of eventFolders) {
    // Gets all files within the event folder
    const eventFiles = getAllFiles(eventFolder);
    
    // Sorts files inside folders so that files with lower numbers get higher priority
    eventFiles.sort((a, b) => (a > b ? 1 : -1));

    // Gets the name of the event based on the folder name
    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    if (!eventName) continue; // Ensure eventName is valid

    // Listens for events to happen and then calls the required event
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const module = await import(pathToFileURL(eventFile).href);
        const eventFunction = module.default;

        if (typeof eventFunction === 'function') {
          await eventFunction(client, arg);
        } else {
          console.error(`Default export in ${eventFile} is not a function`);
        }
      }
    });
  }
};