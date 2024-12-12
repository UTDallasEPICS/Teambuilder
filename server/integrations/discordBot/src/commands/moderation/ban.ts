import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
} from 'discord.js';

const banCommand = {
  name: 'ban',
  description: 'Bans a user from the server',
  options: [
    {
      name: 'target-user',
      description: 'The user to ban',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the ban',
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
    const reason =
      (interaction.options.get('reason')?.value as string) || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild?.members.fetch(targetUserId);

    if (!targetUser) {
      interaction.editReply('User not found.');
      return;
    }

    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `User ${targetUser.user.tag} was banned\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
      await interaction.editReply(`There was an error when banning: ${error}`);
    }
  },
};

export default banCommand;
