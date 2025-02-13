import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
} from 'discord.js';

const kickCommand = {
  name: 'kick',
  description: 'Kicks a user from the server',
  options: [
    {
      name: 'target-user',
      description: 'The user to kick',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the kick',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  defaultPermission: false,
  permissions: [
    {
      id: 'ROLE_ID', // Replace with the actual role ID that should have permission
      type: 'ROLE',
      permission: true,
    },
  ],

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const targetUserId = interaction.options.get('target-user')?.value as string;
    const reason = (interaction.options.get('reason')?.value as string) || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild?.members.fetch(targetUserId);

    if (!targetUser) {
      interaction.editReply('User not found.');
      return;
    }

    // Kick the targetUser
    try {
      await targetUser.kick(reason);
      await interaction.editReply(
        `User ${targetUser.user.tag} was kicked\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
      await interaction.editReply(`There was an error when kicking: ${error}`);
    }
  },
};

export default kickCommand;
