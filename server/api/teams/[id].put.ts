import type {TeamUpdate} from "~/server/services/teamService";
import teamService from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<TeamUpdate>(event);
  return await teamService.updateTeam(id, data);
});
