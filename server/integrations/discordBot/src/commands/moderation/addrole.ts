import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  Role,
} from "discord.js";

const addRoleCommand = {
  name: 'addrole',
  description: 'Adds a role to a user',
  options: [
    {
      name: 'target-user',
      description: 'The user to add the role to',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'role',
      description: 'The role to add',
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

    const targetUser = await interaction.guild?.members.fetch(targetUserId);
    const role = await interaction.options.getRole("role") as Role;

    if (!targetUser || !role) {
      interaction.editReply('User or role not found.');
      return;
    }

    try {
      await targetUser.roles.add(role);
      interaction.editReply(`Role ${role.name} added to ${targetUser.user.tag}.`);
    } catch (error) {
      console.error(error);
      interaction.editReply('Failed to add role.');
    }
  },
};

export default addRoleCommand;
