import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import getAllFiles from './getAllFiles';

interface CommandObject {
  name: string;
  [key: string]: any;
}

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getLocalCommands = async (exceptions: string[] = []): Promise<CommandObject[]> => {
  // Array for storing all commands
  let localCommands: CommandObject[] = [];

  // Gets the category folders (/misc, /moderation, etc.)
  const commandCategories = getAllFiles(
    join(__dirname, '..', 'commands'),
    true
  );

  // Loops through command categories
  for (const commandCategory of commandCategories) {
    // Gets all files within command categories
    const commandFiles = getAllFiles(commandCategory);

    // Create an array of promises for dynamic imports
    const importPromises = commandFiles.map(async (commandFile) => {
      // Skip files in the exceptions list
      if (exceptions.includes(commandFile)) return;

      try {
        // Dynamically import the command file
        const commandModule = await import(pathToFileURL(commandFile).href);
        const command = commandModule.default;
        localCommands.push(command);
      } catch (error) {
        console.error(`Failed to import command file ${commandFile}:`, error);
      }
    });

    // Wait for all imports to complete
    await Promise.all(importPromises);
  }

  return localCommands;
};

export default getLocalCommands;
