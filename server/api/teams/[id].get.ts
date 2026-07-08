import teamService from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const team = await teamService.getTeamById(id);
  if (!team) {
    throw createError({statusCode: 404, statusMessage: 'Team not found'});
  }

  return team;
});
