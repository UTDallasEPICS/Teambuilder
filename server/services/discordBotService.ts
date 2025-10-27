import { Client, IntentsBitField } from 'discord.js';
import eventHandler from '../integrations/discordBot/src/handlers/eventHandler';
import { setClient } from '../integrations/discordBot/src/utils/clientInstance';

let botClient: Client | null = null;
let botStatus: 'running' | 'stopped' | 'error' = 'stopped';
let botError: string | null = null;

export async function startDiscordBot(): Promise<{ success: boolean; message: string }> {
  if (botClient && botStatus === 'running') {
    return { success: false, message: 'Bot is already running' };
  }

  try {
    const token = process.env.DISCORD_BOT_TOKEN || process.env.TOKEN;
    
    if (!token) {
      throw new Error('DISCORD_BOT_TOKEN or TOKEN is not defined in environment variables');
    }

    botClient = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
      ],
    });

    eventHandler(botClient);
    setClient(botClient);

    await botClient.login(token);
    
    botStatus = 'running';
    botError = null;
    
    console.log('✅ SCIPE Discord bot started successfully');
    return { success: true, message: 'Bot started successfully' };
  } catch (error) {
    botStatus = 'error';
    botError = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error starting Discord bot:', error);
    return { success: false, message: `Failed to start bot: ${botError}` };
  }
}
export async function stopDiscordBot(): Promise<{ success: boolean; message: string }> {
  if (!botClient || botStatus === 'stopped') {
    return { success: false, message: 'Bot is not running' };
  }

  try {
    await botClient.destroy();
    botClient = null;
    botStatus = 'stopped';
    botError = null;
    
    console.log('🛑 SCIPE Discord bot stopped');
    return { success: true, message: 'Bot stopped successfully' };
  } catch (error) {
    botStatus = 'error';
    botError = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error stopping Discord bot:', error);
    return { success: false, message: `Failed to stop bot: ${botError}` };
  }
}


export async function restartDiscordBot(): Promise<{ success: boolean; message: string }> {
  const stopResult = await stopDiscordBot();
  if (stopResult.success || botStatus === 'stopped') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await startDiscordBot();
  }
  return stopResult;
}

export function getBotStatus(): { status: string; error: string | null; uptime: number | null } {
  return {
    status: botStatus,
    error: botError,
    uptime: botClient?.uptime || null,
  };
}

export function getBotClient(): Client | null {
  return botClient;
}
