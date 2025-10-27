import { Client } from 'discord.js';

let client: Client | null = null;

export const setClient = (discordClient: Client) => {
    client = discordClient;
};

export const getClient = (): Client => {
    if (!client) {
        throw new Error('Client has not been initialized.');
    }
    return client;
};