/**
 * @file createProjectDiscord.ts
 * 
 * This file contains the implementation of the `createProjectDiscord` function, which is responsible for creating a project category and associated text and voice channels in a Discord server.
 * 
 * The function checks if a category with the specified project name exists. If not, it creates the category. It then checks if a text channel with the specified name exists under the category. If not, it creates the text channel. The function also sets permission overwrites for the created category and channels.
 * 
 * @module createProjectDiscord
 */

import {
    Client,
    Guild,
    PermissionFlagsBits,
    CategoryChannel,
    TextChannel,
    ChannelType,
    VoiceChannel,
} from "discord.js";
import { getClient } from "../utils/clientInstance";
import { Project } from "@prisma/client";

/**
 * Creates a project category, associated text and voice channels, and roles in a Discord server.
 * 
 * This function checks if a category with the specified project name exists. If not, it creates the category.
 * It then checks if a text/voice channels with the specified name exists under the category. If not, it creates the text/voice channels.
 * The function also sets permission overwrites for the created category and channels.
 * 
 * @param {Project} project - The project object containing details about the project.
 * 
 * @throws {Error} If the GUILD_ID environment variable is not defined or if an error occurs while creating the category or channels.
 */
const createProjectDiscord = async (project: Project) => {
    const client = getClient();
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
        throw new Error("GUILD_ID is not defined");
    }
    // Get the list of existing channels in the guild
    const guild: Guild = await client.guilds.fetch(guildId);
    const existingChannels = guild.channels.cache;
    const projectName = project.name;

    const formattedChannelName = projectName.toLowerCase().replace(/\s+/g, "-");

    // Check if a role with the formatted name already exists
    const formattedRoleName = `${projectName} - Current`;
    let projectRole = guild.roles.cache.find(
        (role) => role.name === formattedRoleName
    );

    const adminRole = guild.roles.cache.find(r => r.name === "Professor/Faculty/Staff");
    if (!adminRole) {
        console.error('Role "Professor/Faculty/Staff" not found');
        return;
    }

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
                    {
                        id: adminRole.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            }) as CategoryChannel;
            console.log(`Created category: ${formattedChannelName}`);
        } catch (error) {
            console.error(`Error creating category ${formattedChannelName}:`, error);
        }
    }

        // If category still doesn't exist (e.g., server hit 500 channel limit), skip channel creation
        if (!projectCategory) {
            console.warn(
                `[DiscordBot] Skipping channel creation for ${formattedChannelName} because category is missing (possibly due to channel limit).`
            );
            return;
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
                    {
                        id: adminRole.id,
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
                    {
                        id: adminRole.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            }) as VoiceChannel;
            console.log(`Created voice channel: ${formattedChannelName}`);
        } catch (error) {
            console.error(`Error creating voice channel ${formattedChannelName}:`, error);
        }
    }
};

// Export the createProjectDiscord function
export default createProjectDiscord;