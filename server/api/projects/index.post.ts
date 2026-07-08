import type {ProjectCreate} from "~/server/services/projectService";
import projectService from "~/server/services/projectService";

export default defineEventHandler(async (event) => {
  const data = await readBody<ProjectCreate>(event);
  setResponseStatus(event, 201);
  return await projectService.createProject(data);
});
