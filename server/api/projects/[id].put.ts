import type {ProjectUpdate} from "~/server/services/projectService";
import projectService from "~/server/services/projectService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<ProjectUpdate>(event);
  return await projectService.updateProject(id, data);
});
