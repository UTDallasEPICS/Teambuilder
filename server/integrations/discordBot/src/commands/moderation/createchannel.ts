import { 
  ApplicationCommandOptionType,  
  ChatInputCommandInteraction, 
  Client 
} from 'discord.js';

const createChannelCommand = {
  name: 'createchannel',
  description: 'Creates a new channel',
  options: [
    {
      name: 'name',
      description: 'The name of the channel',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'category',
      description: 'The category to create the channel in',
      type: ApplicationCommandOptionType.Channel,
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
    // Defer the reply to give us time to process
    await interaction.deferReply();

    // Extract the name of the channel from the command options
    const channelName = interaction.options.getString('name');
    const categoryId = interaction.options.getChannel('category');

    try {
      // Create the new channel
      const newChannel = await interaction.guild?.channels.create({
        name: channelName!,
        parent: categoryId?.id,
      });

      interaction.editReply(`Channel ${newChannel?.name} created successfully.`);
    } catch (error) {
      console.error(error);
      interaction.editReply('Failed to create channel.');
    }
  },
};

export default createChannelCommand;
