/**
 * API endpoint to get Discord bot diagnostics
 * GET /api/discord/diagnostics
 */
import { getClient } from '~/server/integrations/discordBot/src/utils/clientInstance';

export default defineEventHandler(async (event) => {
  try {
    const client = getClient();
    
    if (!client) {
      return {
        error: 'Discord client not initialized',
        isReady: false,
      };
    }

    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return {
        error: 'GUILD_ID environment variable not set',
        isReady: client.isReady(),
        user: client.user?.tag,
      };
    }

    let guild;
    try {
      guild = await client.guilds.fetch(guildId);
    } catch (err: any) {
      return {
        error: `Failed to fetch guild: ${err.message}`,
        isReady: client.isReady(),
        user: client.user?.tag,
        guildId,
      };
    }

    // Get bot member in the guild
    const botMember = await guild.members.fetch(client.user!.id);
    
    // Check permissions
    const permissions = botMember.permissions;
    const hasManageChannels = permissions.has('ManageChannels');
    const hasManageRoles = permissions.has('ManageRoles');
    const hasViewChannels = permissions.has('ViewChannel');

    // Get channel counts
    const channels = guild.channels.cache;
    const categories = channels.filter(c => c.type === 4).size; // CategoryChannel
    const textChannels = channels.filter(c => c.type === 0).size; // TextChannel
    const voiceChannels = channels.filter(c => c.type === 2).size; // VoiceChannel
    const totalChannels = channels.size;

    // Get role info
    const roles = guild.roles.cache;
    const projectRoles = roles.filter(r => r.name.endsWith(' - Current'));
    const hasAdminRole = roles.some(r => r.name === 'Professor/Faculty/Staff');

    return {
      success: true,
      bot: {
        tag: client.user?.tag,
        id: client.user?.id,
        isReady: client.isReady(),
      },
      guild: {
        id: guild.id,
        name: guild.name,
        memberCount: guild.memberCount,
      },
      permissions: {
        manageChannels: hasManageChannels,
        manageRoles: hasManageRoles,
        viewChannel: hasViewChannels,
        all: botMember.permissions.toArray(),
      },
      channels: {
        total: totalChannels,
        categories,
        text: textChannels,
        voice: voiceChannels,
        limit: 500,
        remaining: 500 - totalChannels,
      },
      roles: {
        total: roles.size,
        projectRoles: projectRoles.size,
        projectRoleNames: projectRoles.map(r => r.name),
        hasAdminRole,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message || 'Unknown error',
      stack: error?.stack,
    };
  }
});
