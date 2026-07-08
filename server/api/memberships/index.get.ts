import membershipService from "~/server/services/membershipService";

export default defineEventHandler(async () => {
  return await membershipService.getAllMemberships();
});
