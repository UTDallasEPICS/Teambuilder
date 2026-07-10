import {createOrSyncTeamRepositories} from '~/server/services/githubService';
import {prisma} from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ semesterId?: string; projectIds?: string[] }>(event);

  if (!body?.semesterId) {
    throw createError({statusCode: 400, message: 'semesterId is required'});
  }

  const normalizedProjectIds = Array.isArray(body.projectIds)
      ? Array.from(new Set(body.projectIds
          .filter((id): id is string => typeof id === 'string')
          .map(id => id.trim())
          .filter(Boolean)))
      : [];

  const teams = await prisma.team.findMany({
    where: {
      semesterId: body.semesterId,
      ...(normalizedProjectIds.length > 0 ? {projectId: {in: normalizedProjectIds}} : {}),
    },
    include: {
      Project: {select: {name: true}},
      Memberships: { include: { Student: {select: {github: true}} } }
    },
  });

  if (teams.length === 0) {
    throw createError({
      statusCode: 404,
      message: normalizedProjectIds.length > 0
          ? 'No teams found for this semester and selected team filter'
          : 'No teams found for this semester',
    });
  }

  const inputs = teams.map((team) => ({
    projectName: team.Project.name,
    githubUsernames: team.Memberships
        .map((m) => m.Student.github?.trim())
        .filter((username: string | undefined): username is string => Boolean(username)),
  }));

  const result = await createOrSyncTeamRepositories(inputs);

  return {
    success: result.success,
    message: result.message,
    results: result.results,
    timestamp: new Date().toISOString(),
  };
});
