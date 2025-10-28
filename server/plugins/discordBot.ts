import { Client, IntentsBitField } from 'discord.js';
import { setClient } from '../integrations/discordBot/src/utils/clientInstance';

export default async () => {
  const token = process.env.DISCORD_BOT_TOKEN || process.env.TOKEN;
  if (!token) {
    console.error('[DiscordBot] DISCORD_BOT_TOKEN or TOKEN is not defined in environment variables');
    return;
  }

  let tsRuntimeRegistered = false;
  const tryRegister = async () => {
    const attempts: { name: string; loader: () => Promise<boolean> }[] = [
      {
        name: 'esbuild-register (dist/node)',
        loader: async () => {
          const mod = await import('esbuild-register/dist/node');
          if (mod && typeof mod.register === 'function') {
            mod.register({ extensions: ['.ts', '.tsx'] });
            return true;
          }
          return false;
        },
      },
      {
        name: 'esbuild-register (package)',
        loader: async () => {
          const mod = await import('esbuild-register');
          if (mod && typeof (mod as any).register === 'function') {
            (mod as any).register({ extensions: ['.ts', '.tsx'] });
            return true;
          }
          return false;
        },
      },
      {
        name: 'ts-node/esm',
        loader: async () => {
          await import('ts-node/esm');
          return true;
        },
      },
      {
        name: 'ts-node/register',
        loader: async () => {
          await import('ts-node/register');
          return true;
        },
      },
      {
        name: 'ts-node (programmatic)',
        loader: async () => {
          const mod = await import('ts-node');
          if (mod && typeof (mod as any).register === 'function') {
            (mod as any).register({ transpileOnly: true, skipProject: true });
            return true;
          }
          return false;
        },
      },
    ];

    for (const attempt of attempts) {
      try {
        const ok = await attempt.loader();
        if (ok) {
          console.log(`[DiscordBot] Registered TypeScript runtime via ${attempt.name}`);
          return true;
        }
      } catch (err) {
      }
    }
    return false;
  };

  try {
    tsRuntimeRegistered = await tryRegister();
  } catch (e) {
    tsRuntimeRegistered = false;
  }

  if (!tsRuntimeRegistered) {
    console.warn('[DiscordBot] No TypeScript runtime found. To load .ts event handlers at runtime, install one of:\n' +
      "  pnpm add -D esbuild-register" + '\n' +
      "  or pnpm add -D ts-node" + '\n' +
      'After installing, restart the dev server. Falling back to JS-only imports.');
  }

  let eventHandler: any = null;
  try {
    const mod = await import('../integrations/discordBot/src/handlers/eventHandler');
    eventHandler = mod?.default || mod;
  } catch (err) {
    console.error('[DiscordBot] Failed to import eventHandler:', err);
  }

  const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });

  if (eventHandler) {
    try {
      eventHandler(client);
    } catch (err) {
      console.error('[DiscordBot] eventHandler threw an error during registration:', err);
    }
  } else {
    console.warn('[DiscordBot] eventHandler is not available; no events will be registered.');
  }

  setClient(client);

  try {
    await client.login(token);
    console.log('[DiscordBot] Bot started and logged in successfully');
  } catch (error) {
    console.error('[DiscordBot] Failed to login:', error);
  }
};
