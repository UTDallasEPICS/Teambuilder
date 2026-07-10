import type {MembershipCreate} from "~/server/services/membershipService";
import membershipService from "~/server/services/membershipService";

export default defineEventHandler(async (event) => {
  const data = await readBody<MembershipCreate>(event);
  setResponseStatus(event, 201);
  return await membershipService.createMembership(data);
});
