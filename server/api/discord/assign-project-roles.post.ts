import { defineEventHandler, readBody } from 'h3';
import { getClient } from '~/server/integrations/discordBot/src/utils/clientInstance';
import semesterService from '~/server/services/semesterService';
import projectService from '~/server/services/projectService';
import studentService from '~/server/services/studentService';

type Body = {
  semesterId?: string;
};

const normalizeDiscordHandle = (value: string): string => value.trim().replace(/^@/, '').toLowerCase();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Body>(event);

    let semesterId = body?.semesterId;
    if (!semesterId) {
      const semester = await semesterService.getRecentSemester();
      if (!semester) {
        return { success: false, message: 'No semesters found in database.' };
      }
      semesterId = semester.id;
    }

    const [projects, students] = await Promise.all([
      projectService.getAllProjects(),
      studentService.getAllStudents(),
    ]);
    const studentsById = new Map(students.map((s) => [s.id, s]));

    const projectTeams = projects.flatMap((project) =>
      project.Teams
        .filter((team) => team.semesterId === semesterId)
        .map((team) => ({
          projectName: project.name,
          students: team.Memberships
            .map((membership) => studentsById.get(membership.studentId)!),
        }))
    );

    if (projectTeams.length === 0) {
      return { success: false, message: 'No teams found for selected semester.' };
    }

    const client = getClient();
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return { success: false, message: 'GUILD_ID is not defined in environment variables.' };
    }

    const guild = await client.guilds.fetch(guildId);
    await guild.members.fetch();

    const assigned: Array<{ student: string; role: string }> = [];
    const errors: string[] = [];

    for (const team of projectTeams) {
      const roleName = `${team.projectName} - Current`;
      const role = guild.roles.cache.find(r => r.name === roleName);

      if (!role) {
        errors.push(`${team.projectName}: role '${roleName}' does not exist. Run channel/role creation first.`);
        continue;
      }

      for (const student of team.students) {
        if (!student.discord) {
          errors.push(`${student.firstName} ${student.lastName}: no Discord username in student record.`);
          continue;
        }

        const handle = normalizeDiscordHandle(student.discord);

        const member = guild.members.cache.find(m => {
          const username = m.user.username?.toLowerCase();
          const globalName = m.user.globalName?.toLowerCase();
          const displayName = m.displayName?.toLowerCase();
          const tag = `${m.user.username}#${m.user.discriminator}`.toLowerCase();
          return handle === username || handle === globalName || handle === displayName || handle === tag;
        });

        if (!member) {
          errors.push(`${student.firstName} ${student.lastName}: Discord user '${student.discord}' not found in guild.`);
          continue;
        }

        if (member.roles.cache.has(role.id)) {
          continue;
        }

        try {
          await member.roles.add(role);
          assigned.push({
            student: `${student.firstName} ${student.lastName}`,
            role: roleName,
          });
        } catch (err: any) {
          errors.push(`${student.firstName} ${student.lastName}: failed to assign '${roleName}' (${err?.message || err}).`);
        }
      }
    }

    return {
      success: errors.length === 0,
      message: `Assigned ${assigned.length} project role(s).`,
      assignedCount: assigned.length,
      assigned,
      errors,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to assign project roles.',
    };
  }
});
