import projectService from "~/server/services/projectService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const project = await projectService.getProjectById(id);
  if (!project) {
    throw createError({statusCode: 404, statusMessage: 'Project not found'});
  }

  return project;
});
