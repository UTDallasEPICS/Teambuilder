import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, basename } from 'path';
import fs from 'fs';
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

  // Resolve commands directory robustly. Prefer project-root path so this works when code is bundled to temp.
  const candidateProjectPath = join(process.cwd(), 'server', 'integrations', 'discordBot', 'src', 'commands');
  const candidateRelativePath = join(__dirname, '..', 'commands');

  let commandsDir: string | null = null;
  if (fs.existsSync(candidateProjectPath)) {
    commandsDir = candidateProjectPath;
  } else if (fs.existsSync(candidateRelativePath)) {
    commandsDir = candidateRelativePath;
  } else {
    console.warn(`[DiscordBot] Commands folder not found. Checked:\n  ${candidateProjectPath}\n  ${candidateRelativePath}`);
    return [];
  }

  // Gets the category folders (/misc, /moderation, etc.)
  const commandCategories = getAllFiles(commandsDir, true);

  // Loops through command categories
  for (const commandCategory of commandCategories) {
    // Gets all files within command categories
    const commandFiles = getAllFiles(commandCategory);

    // Create an array of promises for dynamic imports
    const importPromises = commandFiles.map(async (commandFile) => {
      // Skip files in the exceptions list
      if (exceptions.includes(commandFile)) return;

      try {
        let commandModule: any;
        try {
          const { default: jiti } = await import('jiti');
          const j = (jiti as any)(import.meta.url);
          commandModule = j(commandFile);
        } catch (e) {
          // Fallback to native dynamic import for .js files
          commandModule = await import(pathToFileURL(commandFile).href);
        }
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
