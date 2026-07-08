import projectService from "~/server/services/projectService";

export default defineEventHandler(async () => {
  return await projectService.getAllProjects();
});
