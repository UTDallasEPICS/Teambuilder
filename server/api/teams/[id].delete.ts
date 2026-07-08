import teamService from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await teamService.deleteTeam(id);
  return null;
});
