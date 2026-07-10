import type {TeamCreate} from "~/server/services/teamService";
import teamService from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  const data = await readBody<TeamCreate>(event);
  setResponseStatus(event, 201);
  return await teamService.createTeam(data);
});
