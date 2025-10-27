/**
 * @file syncChannelsAndRoles.ts
 * 
 * This file contains the implementation of the `syncChannelsAndRoles` function, which is responsible for synchronizing channels and roles in a Discord server based on the data provided in a `data.json` file.
 * 
 * Note: This function follows an outdated methodology that takes in a `data.json` file of all the projects.
 * 
 * @module syncChannelsAndRoles
 */
import fs from "fs";
import {
  Client,
  Guild,
  PermissionFlagsBits,
  CategoryChannel,
  TextChannel,
  ChannelType,
  VoiceChannel,
} from "discord.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Synchronizes channels and roles in a Discord server based on the data provided in a `data.json` file locatted in the root folder of the bot.
 * 
 * This function reads the `data.json` file, which contains information about all the projects, and creates or updates the corresponding channels and roles in the Discord server.
 * 
 * Note: This function follows an outdated methodology that takes in a `data.json` file of all the projects instead of taking a project object.
 * 
 * @param {Client} client - The Discord client instance.
 * @param {string} guildId - The ID of the Discord guild (server) where the channels and roles will be synchronized.
 * 
 * @throws {Error} If an error occurs while reading the `data.json` file or synchronizing the channels and roles.
 */
const syncChannelsAndRoles = async (client: Client, guildId: string) => {
  try {
    // Convert import.meta.url to __dirname equivalent
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Define the path to the data.json file
    const filePath = join(__dirname, "..", "..", "data.json");

    // Read and parse the data.json file
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Extract project names from the data
    const projectNames = data.partners.flatMap((partner: { projects: { name: string }[] }) =>
      partner.projects.map((project) => project.name)
    );

    // Get the list of existing channels in the guild
    const guild: Guild = await client.guilds.fetch(guildId);
    const existingChannels = guild.channels.cache;

    // Loop through each project name
    for (const projectName of projectNames) {
      // Convert project name to Discord channel format (replace spaces with hyphens and make lowercase)
      const formattedChannelName = projectName.toLowerCase().replace(/\s+/g, "-");

      // Check if a role with the formatted name already exists
      const formattedRoleName = `${projectName} - Current`;
      let projectRole = guild.roles.cache.find(
        (role) => role.name === formattedRoleName
      );

      // If the role doesn't exist, create it
      if (!projectRole) {
        projectRole = await guild.roles.create({
          name: formattedRoleName,
          permissions: [],
        });
      }

      // Check if a category with the formatted name already exists
      let projectCategory = existingChannels.find(
        (channel) => channel.name === formattedChannelName && channel.type === ChannelType.GuildCategory
      ) as CategoryChannel;

      // If the category doesn't exist, create it
      if (!projectCategory) {
        try {
          projectCategory = await guild.channels.create({
            name: formattedChannelName,
            type: ChannelType.GuildCategory,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: projectRole.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          }) as CategoryChannel;
          console.log(`Created category: ${formattedChannelName}`);
        } catch (error) {
          console.error(`Error creating category ${formattedChannelName}:`, error);
          continue;
        }
      }

      // Check if a text channel with the formatted name already exists under the category
      const textChannelExists = existingChannels.some(
        (channel) => channel.name === formattedChannelName && channel.parentId === projectCategory.id && channel.type === ChannelType.GuildText
      );

      // If the text channel doesn't exist, create it
      if (!textChannelExists) {
        try {
          await guild.channels.create({
            name: formattedChannelName,
            type: ChannelType.GuildText,
            parent: projectCategory.id,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: projectRole.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          }) as TextChannel;
          console.log(`Created text channel: ${formattedChannelName}`);
        } catch (error) {
          console.error(`Error creating text channel ${formattedChannelName}:`, error);
        }
      }

      // Check if a voice channel with the formatted name already exists under the category
      const voiceChannelExists = existingChannels.some(
        (channel) => channel.name === formattedChannelName && channel.parentId === projectCategory.id && channel.type === ChannelType.GuildVoice
      );

      // If the voice channel doesn't exist, create it
      if (!voiceChannelExists) {
        try {
          await guild.channels.create({
            name: formattedChannelName,
            type: ChannelType.GuildVoice,
            parent: projectCategory.id,
            permissionOverwrites: [
              {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
              {
                id: projectRole.id,
                allow: [PermissionFlagsBits.ViewChannel],
              },
            ],
          }) as VoiceChannel;
          console.log(`Created voice channel: ${formattedChannelName}`);
        } catch (error) {
          console.error(`Error creating voice channel ${formattedChannelName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error syncing projects with channels:", error);
  }
};

export default syncChannelsAndRoles;