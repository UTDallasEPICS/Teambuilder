/**
 * API endpoint to get Discord bot status
 * GET /api/discord/status
 */

import { getBotStatus } from '~/server/services/discordBotService';

export default defineEventHandler(async (event) => {
  try {
    const status = getBotStatus();
    
    return {
      success: true,
      data: {
        status: status.status,
        error: status.error,
        uptime: status.uptime,
        uptimeFormatted: status.uptime ? formatUptime(status.uptime) : null,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to get bot status',
    });
  }
});

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
