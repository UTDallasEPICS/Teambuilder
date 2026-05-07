import { defineEventHandler, useQuery } from 'h3';
import { getClient as getDiscordClient } from '~/server/integrations/discordBot/src/utils/clientInstance';

export default defineEventHandler(async (event) => {
  try {
    const query = useQuery(event);
    const semesterId = (query.semesterId as string) || undefined;

    // Resolve semester: if not provided, use latest
    let resolvedSemesterId = semesterId;
    if (!resolvedSemesterId) {
      const latest = await event.context.client.semester.findFirst({ orderBy: { createdAt: 'desc' } });
      if (latest) resolvedSemesterId = latest.id;
    }

    if (!resolvedSemesterId) {
      return { success: false, message: 'No semester found' };
    }

    // Get projects for semester via teams (projects are referenced on teams)
    const teams = await event.context.client.team.findMany({
      where: { semesterId: resolvedSemesterId },
      include: { project: { select: { name: true, id: true } } },
    });

    const projectNames = Array.from(new Set(teams.map(t => t.project?.name).filter(Boolean)));

    const discordClient = getDiscordClient();
    const guildId = process.env.GUILD_ID;
    if (!discordClient || !guildId) {
      return { success: false, message: 'Discord client or GUILD_ID not available' };
    }

    const guild = await discordClient.guilds.fetch(guildId);
    await guild.roles.fetch();

    const roles = guild.roles.cache;

    // Roles that follow the convention "<Project Name> - Current"
    const projectRoleSuffix = ' - Current';

    const projectRoleMatches: { projectName: string; roleId?: string; roleName?: string }[] = projectNames.map((p) => {
      const expected = `${p}${projectRoleSuffix}`;
      const role = roles.find(r => r.name === expected);
      return { projectName: p, roleId: role?.id, roleName: role?.name };
    });

    // Roles in guild that look like project roles (end with suffix)
    const guildProjectRoles = roles.filter(r => r.name.endsWith(projectRoleSuffix)).map(r => ({ id: r.id, name: r.name }));

    // Non-project roles (as simple names) - sample a subset to avoid huge payloads
    const nonProjectRoles = roles.filter(r => !r.name.endsWith(projectRoleSuffix)).map(r => ({ id: r.id, name: r.name }));

    return {
      success: true,
      semesterId: resolvedSemesterId,
      projects: projectRoleMatches,
      guildProjectRoles,
      nonProjectRoles,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
});
