import dotenv from 'dotenv';
import { Client, IntentsBitField } from 'discord.js';
import eventHandler from './handlers/eventHandler';
import { setClient } from './utils/clientInstance';

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);
setClient(client);

client.login(process.env.TOKEN);