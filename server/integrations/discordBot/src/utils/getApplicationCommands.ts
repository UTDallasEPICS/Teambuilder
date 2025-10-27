import { Client, Guild, ApplicationCommandManager, GuildApplicationCommandManager } from 'discord.js';

// Gets all command files registered with the discord bot
const getApplicationCommands = async (client: Client, guildId?: string): Promise<ApplicationCommandManager | GuildApplicationCommandManager> => {
  let applicationCommands: ApplicationCommandManager | GuildApplicationCommandManager;

  // If server exists
  if (guildId) {
    const guild: Guild = await client.guilds.fetch(guildId);
    // Copies a list of registered server commands to applicationCommands
    applicationCommands = guild.commands;
  } else {
    // Fetches global commands
    if (!client.application) {
      throw new Error('Client application is not available');
    }
    applicationCommands = client.application.commands;
  }

  await applicationCommands.fetch({ force: true });
  return applicationCommands;
};

export default getApplicationCommands;
