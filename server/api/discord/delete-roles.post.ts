/**
 * API endpoint to delete all project roles created by the bot
 * Deletes all roles with the " - Current" suffix
 */
import { defineEventHandler } from 'h3';
import { getClient } from '../../integrations/discordBot/src/utils/clientInstance';

export default defineEventHandler(async (event) => {
  try {
    const client = getClient();
    const guildId = process.env.GUILD_ID;

    if (!guildId) {
      return {
        success: false,
        error: 'GUILD_ID is not defined in environment variables',
      };
    }

    // Fetch the guild
    const guild = await client.guilds.fetch(guildId);
    
    // Find all roles that end with " - Current"
    const projectRoles = guild.roles.cache.filter(role => 
      role.name.endsWith(' - Current')
    );

    if (projectRoles.size === 0) {
      return {
        success: true,
        message: 'No project roles found to delete',
        deletedCount: 0,
        roles: [],
      };
    }

    const deletedRoles: string[] = [];
    const errors: { role: string; error: string }[] = [];

    // Delete each role
    for (const [roleId, role] of projectRoles) {
      try {
        await role.delete(`Bulk delete via bot management`);
        deletedRoles.push(role.name);
        console.log(`[DiscordBot] Deleted role: ${role.name}`);
      } catch (error: any) {
        const errorMsg = error?.message || 'Unknown error';
        errors.push({ role: role.name, error: errorMsg });
        console.error(`[DiscordBot] Failed to delete role ${role.name}:`, errorMsg);
      }
    }

    return {
      success: true,
      message: `Deleted ${deletedRoles.length} role(s)`,
      deletedCount: deletedRoles.length,
      roles: deletedRoles,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    console.error('[DiscordBot] Error deleting roles:', error);
    return {
      success: false,
      error: error?.message || 'Failed to delete roles',
    };
  }
});
