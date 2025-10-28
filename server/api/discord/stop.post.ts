/**
 * API endpoint to stop the Discord bot
 * POST /api/discord/stop
 */

import { stopDiscordBot } from '~/server/services/discordBotService';

export default defineEventHandler(async (event) => {
  try {
    const result = await stopDiscordBot();
    
    return {
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to stop bot',
    });
  }
});
