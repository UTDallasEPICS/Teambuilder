import teamService from "~/server/services/teamService";

export default defineEventHandler(async () => {
  return await teamService.getAllTeams();
});
