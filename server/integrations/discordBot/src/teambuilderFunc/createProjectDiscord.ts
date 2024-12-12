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

// Export the createProjectDiscord function as default
export default createProjectDiscord;