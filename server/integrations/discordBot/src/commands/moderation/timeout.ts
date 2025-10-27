import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  GuildMember,
} from "discord.js";

const timeoutCommand = {
  name: 'timeout',
  description: 'Timeout a user for a specified duration',
  options: [
    {
      name: 'target-user',
      description: 'The user to timeout',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'duration',
      description: 'The duration of the timeout in minutes',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the timeout',
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
    const targetUserId = interaction.options.get("target-user")!.value as string;
    const timeoutDuration = interaction.options.get("duration")!.value as number; // Duration in minutes
    const reason = interaction.options.get("reason")?.value as string || "No reason provided";

    await interaction.deferReply();

    if (!interaction.guild) {
      await interaction.editReply("This command can only be used in a server.");
      return;
    }

    const targetUser = await interaction.guild.members.fetch(targetUserId) as GuildMember;

    if (!targetUser) {
      await interaction.editReply("User not found.");
      return;
    }

    try {
      await targetUser.timeout(timeoutDuration * 60 * 1000, reason); // Convert minutes to milliseconds
      await interaction.editReply(`User ${targetUser.user.tag} has been timed out for ${timeoutDuration} minutes. Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      await interaction.editReply("Failed to timeout user.");
    }
  },
};

export default timeoutCommand;
