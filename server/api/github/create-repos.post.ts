import { createOrSyncTeamRepositories } from '~/server/services/githubService';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ semesterId?: string }>(event);

  if (!body?.semesterId) {
    throw createError({ statusCode: 400, message: 'semesterId is required' });
  }

  const teams = await event.context.client.team.findMany({
    where: { semesterId: body.semesterId },
    include: {
      project: { select: { name: true } },
      students: { select: { github: true } },
    },
  });

  if (teams.length === 0) {
    throw createError({ statusCode: 404, message: 'No teams found for this semester' });
  }

  const inputs = teams.map((team: { project: { name: string }; students: Array<{ github: string | null }> }) => ({
    projectName: team.project.name,
    githubUsernames: team.students
      .map((student: { github: string | null }) => student.github?.trim())
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
