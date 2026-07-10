import {defineEventHandler, getQuery} from 'h3';
import {getClient as getDiscordClient} from '~/server/integrations/discordBot/src/utils/clientInstance';
import semesterService from '~/server/services/semesterService';
import projectService from '~/server/services/projectService';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const semesterId = (query.semesterId as string) || undefined;

    // Resolve semester: if not provided, use latest
    let resolvedSemesterId = semesterId;
    if (!resolvedSemesterId) {
      const recentSemester = await semesterService.getRecentSemester();
      if (recentSemester) {
        resolvedSemesterId = recentSemester.id;
      }
    }

    if (!resolvedSemesterId) {
      return {success: false, message: 'No semester found'};
    }

    // Get project names that have a team in this semester
    const projects = await projectService.getAllProjects();
    const projectNames =
        projects
            .filter((project) => project.Teams.some((team) => team.semesterId === resolvedSemesterId))
            .map((project) => project.name);

    const discordClient = getDiscordClient();
    const guildId = process.env.GUILD_ID;
    if (!discordClient || !guildId) {
      return {success: false, message: 'Discord client or GUILD_ID not available'};
    }

    const guild = await discordClient.guilds.fetch(guildId);
    await guild.roles.fetch();

    const roles = guild.roles.cache;

    // Roles that follow the convention "<Project Name> - Current"
    const projectRoleSuffix = ' - Current';

    const projectRoleMatches: { projectName: string; roleId?: string; roleName?: string }[] = projectNames.map((p) => {
      const expected = `${p}${projectRoleSuffix}`;
      const role = roles.find(r => r.name === expected);
      return {projectName: p, roleId: role?.id, roleName: role?.name};
    });

    // Roles in guild that look like project roles (end with suffix)
    const guildProjectRoles = roles.filter(r => r.name.endsWith(projectRoleSuffix)).map(r => ({
      id: r.id,
      name: r.name
    }));

    // Non-project roles (as simple names) - sample a subset to avoid huge payloads
    const nonProjectRoles = roles.filter(r => !r.name.endsWith(projectRoleSuffix)).map(r => ({id: r.id, name: r.name}));

    return {
      success: true,
      semesterId: resolvedSemesterId,
      projects: projectRoleMatches,
      guildProjectRoles,
      nonProjectRoles,
    };
  } catch (err: any) {
    return {success: false, error: err?.message || String(err)};
  }
});
