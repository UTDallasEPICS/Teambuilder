import fs from "fs";
import path from "path";
import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  CategoryChannel,
  TextChannel,
} from "discord.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const syncChannelsCommand = {
  name: 'sync-projects',
  description: 'Sync project names from data.json with Discord text channels.',
  options: [],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],

  /**
   * Syncs project names from data.json with Discord text channels.
   * @param {Client} client - The Discord client.
   * @param {Interaction} interaction - The interaction object from the slash command.
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    try {
      // Defer the reply to give the bot time to process
      await interaction.deferReply();

      if (!interaction.guild) {
        await interaction.editReply("This command can only be used in a server.");
        return;
      }

      // Convert import.meta.url to __dirname equivalent
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      // Define the path to the data.json file
      const filePath = join(__dirname, "..", "..", "..", "data.json");

      // Read and parse the data.json file
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      // Extract project names from the data
      const projectNames = data.partners.flatMap((partner: { projects: { name: string }[] }) =>
        partner.projects.map((project) => project.name)
      );

      // Get the list of existing channels in the guild
      const existingChannels = interaction.guild?.channels.cache;

      // Loop through each project name
      for (const projectName of projectNames) {
        // Convert project name to Discord channel format (replace spaces with hyphens and make lowercase)
        const formattedChannelName = projectName
          .toLowerCase()
          .replace(/\s+/g, "-");

        // Check if a channel with the formatted name already exists
        const channelExists = existingChannels?.some(
          (channel) => channel.name === formattedChannelName
        );

        // Find or create the "projects" category
        let projectsCategory = interaction.guild?.channels.cache.find(
          (channel) => channel.name === "projects" && channel.type === 4 // 4 represents a category in Discord.js v14
        );

        if (!projectsCategory) {
          projectsCategory = await interaction.guild.channels.create({
            name: "projects",
            type: 4, // 4 represents a category
            reason: "Category for project channels",
          });
        }

        // If the channel doesn't exist, create it under the "projects" category
        if (!channelExists) {
          try {
            await interaction.guild.channels.create({
              name: formattedChannelName,
              type: 0, // 0 represents a text channel
              parent: projectsCategory.id, // Set the parent to the "projects" category
              reason: `Channel created for project: ${projectName}`,
            });
            console.log(
              `Created new channel: ${formattedChannelName} under "projects" category`
            );
          } catch (error) {
            console.error(
              `Error creating channel for project ${projectName}:`,
              error
            );
          }
        } else {
          console.log(`Channel already exists for project: ${projectName}`);
        }
      }

      // Reply to the interaction once the process is complete
      await interaction.editReply(
        "Project channels have been synced successfully."
      );
    } catch (error) {
      console.error("Error syncing projects with channels:", error);
      await interaction.editReply(
        "There was an error syncing project channels."
      );
    }
  },
};

export default syncChannelsCommand;
