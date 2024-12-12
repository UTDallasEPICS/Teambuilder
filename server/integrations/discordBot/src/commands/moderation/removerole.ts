import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  GuildMember,
  Role,
} from "discord.js";

const removeRoleCommand = {
  name: 'removerole',
  description: 'Removes a role from a user',
  options: [
    {
      name: 'target-user',
      description: 'The user to remove the role from',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'role',
      description: 'The role to remove',
      type: ApplicationCommandOptionType.Role,
      required: true,
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
    const targetUserId = interaction.options.get("target-user")?.value as string;
    await interaction.deferReply();

    const targetUser = await interaction.guild?.members.fetch(targetUserId) as GuildMember;
    const role = await interaction.options.getRole("role") as Role;

    if (!targetUser || !role) {
      interaction.editReply('User or role not found.');
      return;
    }

    try {
      await targetUser.roles.remove(role);
      interaction.editReply(`Role ${role.name} removed from ${targetUser.user.tag}.`);
    } catch (error) {
      console.error(error);
      interaction.editReply('Failed to remove role.');
    }
  },
};

export default removeRoleCommand;
