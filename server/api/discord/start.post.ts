/**
 * API endpoint to start the Discord bot
 * GET /api/discord/start
 */

import { startDiscordBot } from '~/server/services/discordBotService';

export default defineEventHandler(async (event) => {
  try {
    const result = await startDiscordBot();
    
    return {
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to start bot',
    });
  }
});
