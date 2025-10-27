import { getClient } from '~/server/integrations/discordBot/src/utils/clientInstance';
import { ChannelType } from 'discord.js';

export default defineEventHandler(async (event) => {
  try {
    const client = getClient();
    if (!client || !client.isReady()) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message: 'Discord bot is not ready',
      });
    }

    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration Error',
        message: 'GUILD_ID is not defined',
      });
    }

    const guild = await client.guilds.fetch(guildId);
    
    // Categories to preserve (case-insensitive)
    const preservedCategories = [
      'information',
      'text channels',
      'voice channels',
      'projects'
    ];
    
    // Channels to preserve (case-insensitive) - standard server channels not in categories
    const preservedChannels = [
      'general',
      'welcome-and-rules',
      'announcements',
      'resources',
      'meeting-plans',
      'off-topic',
      'bot-development',
      'lounge',
      'meeting room 1',
      'meeting room 2',
      'events'
    ];
    
    let deletedCategories = 0;
    let deletedTextChannels = 0;
    let deletedVoiceChannels = 0;
    const errors: Array<{ channel: string; error: string }> = [];
    const deletedChannels: string[] = [];

    // First, delete orphaned channels (channels without a parent category)
    const orphanedChannels = guild.channels.cache.filter(
      (channel) => !channel.parentId && 
                   (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) &&
                   !preservedChannels.includes(channel.name.toLowerCase())
    );

    console.log(`Found ${orphanedChannels.size} orphaned channels to delete`);

    for (const [, channel] of orphanedChannels) {
      try {
        await channel.delete(`Bulk delete orphaned project channels`);
        deletedChannels.push(channel.name);
        
        if (channel.type === ChannelType.GuildText) {
          deletedTextChannels++;
        } else if (channel.type === ChannelType.GuildVoice) {
          deletedVoiceChannels++;
        }
        console.log(`Deleted orphaned channel: ${channel.name}`);
      } catch (err: any) {
        console.error(`Failed to delete orphaned channel ${channel.name}:`, err?.message);
        errors.push({
          channel: channel.name,
          error: err?.message || 'Unknown error'
        });
      }
    }

    // Get all categories in the guild
    const categories = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory
    );

    console.log(`Found ${categories.size} total categories`);

    for (const [, category] of categories) {
      // Skip preserved categories
      if (preservedCategories.includes(category.name.toLowerCase())) {
        console.log(`Skipping preserved category: ${category.name}`);
        continue;
      }

      try {
        // First, delete all channels within this category
        const channelsInCategory = guild.channels.cache.filter(
          (channel) => channel.parentId === category.id
        );

        console.log(`Category "${category.name}" has ${channelsInCategory.size} child channels`);

        for (const [, channel] of channelsInCategory) {
          try {
            await channel.delete(`Bulk delete via bot management`);
            deletedChannels.push(channel.name);
            
            if (channel.type === ChannelType.GuildText) {
              deletedTextChannels++;
            } else if (channel.type === ChannelType.GuildVoice) {
              deletedVoiceChannels++;
            }
            console.log(`  Deleted channel: ${channel.name}`);
          } catch (err: any) {
            console.error(`  Failed to delete channel ${channel.name}:`, err?.message);
            errors.push({
              channel: channel.name,
              error: err?.message || 'Unknown error'
            });
          }
        }

        // Then delete the category itself
        await category.delete(`Bulk delete via bot management`);
        deletedCategories++;
        deletedChannels.push(category.name);
        console.log(`Deleted category: ${category.name}`);
      } catch (err: any) {
        console.error(`Failed to delete category ${category.name}:`, err?.message);
        errors.push({
          channel: category.name,
          error: err?.message || 'Unknown error'
        });
      }
    }

    const totalDeleted = deletedCategories + deletedTextChannels + deletedVoiceChannels;

    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully deleted ${totalDeleted} channels (${deletedCategories} categories, ${deletedTextChannels} text, ${deletedVoiceChannels} voice)`
        : `Deleted ${totalDeleted} channels with ${errors.length} errors`,
      deletedCount: totalDeleted,
      categories: deletedCategories,
      textChannels: deletedTextChannels,
      voiceChannels: deletedVoiceChannels,
      channels: deletedChannels,
      errors,
    };
  } catch (error: any) {
    console.error('Error deleting Discord channels:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error?.message || 'Failed to delete Discord channels',
    });
  }
});
