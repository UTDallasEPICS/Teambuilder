// This file handles all slash commands

import type { Client, Interaction, GuildMember } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import getLocalCommands from '../../utils/getLocalCommands.js';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the config.json file
const configPath = join(__dirname, '../../../config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Destructure the necessary fields from the config object
const { devs, testServer } = config;

export default async (client: Client, interaction: Interaction) => {
  //Is the interaction a chat-input command
  if (!interaction.isChatInputCommand()) return;

  //Imports local commands
  const localCommands = await getLocalCommands();

  //Check if command matches local commands
  try {
    //Checks if command names match
    const commandObject = localCommands.find(
      (cmd: { name: string }) => cmd.name === interaction.commandName
    );

    //console.log(commandObject?.name);

    //Checks if commandObject exists
    if (!commandObject) return;

    //Checks if command has "Dev Only" set to true,
    //if so, checks to make sure person running command has 
    //developer permissions.
    if (commandObject.devOnly) {
      if (!interaction.member || !devs.includes((interaction.member as GuildMember).id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command.',
          //Only person running command can see message
          ephemeral: true,
        });
        return;
      }
    } 

    //Checks if command has "Test Only" set to true,
    //if so, checks if the server is a test server.
    //if server isnt a test serevr, bot does not run command.
    if (commandObject.testOnly) {
      if (!interaction.guild || interaction.guild.id !== testServer) {
        interaction.reply({
          content: 'This command cannot be ran here.',
          ephemeral: true,
        });
        return;
      }
    } 

    //Checks if person runnig command has required permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member || !(interaction.member as GuildMember).permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          return;
        }
      }
    }

    //Checks if bot has permissions to run command
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild?.members.me;
        if (!bot) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I don't have enough permissions.",
            ephemeral: true,
          });
          return;
        }
      }
    }

    //If all checks are fine, runs command
    await commandObject.callback(client, interaction);

    //Error handling
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};