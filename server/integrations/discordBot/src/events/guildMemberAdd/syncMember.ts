import { Client, GuildMember } from "discord.js";
import { prisma} from "~/server/utils/db";

interface Membership {
  Team: {
    Project: {
      name: string;
    };
  };
}

/**
 * On guild member add, syncs the member's roles and nickname with their project data in the database.
 * Depends that role names are already created in the format "Project Name - Current".
 * 
 * @param {Client} client - The Discord client.
 * @param {GuildMember} member - The new guild member.
 * @throws {Error} if an error occurs while syncing the member.
 */
const syncMember = async (client: Client, member: GuildMember) => {
  try {
    // Extract the student's project name based on the new member's Discord username
    const student = await prisma.student.findUnique({
      where: {
        discord: member.user.username,
      },
      include: {
        Memberships: {
          include: {
            Team: {
              include: {
                Project: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new Error(`Student with discordUser ${member.user.username} not found`);
    }

    const projects = student.Memberships.map((membership: Membership) => membership.Team.Project);
    for (const project of projects) {
      const projectName = project.name;
      const roleName = `${projectName} - Current`;
      const role = member.guild.roles.cache.find(r => r.name === roleName);
      if (role) {
        await member.roles.add(role);
      }
    }

    await member.setNickname(`${student.firstName} ${student.lastName}`);

    }
    catch (error) {
    console.error('Error syncing member:', error);
    throw error;
  }
};

export default syncMember;