import membershipService from "~/server/services/membershipService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const membership = await membershipService.getMembershipById(id);
  if (!membership) {
    throw createError({statusCode: 404, statusMessage: 'Membership not found'});
  }

  return membership;
});
