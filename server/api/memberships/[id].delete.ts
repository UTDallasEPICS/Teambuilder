import membershipService from "~/server/services/membershipService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await membershipService.deleteMembership(id);
  return null;
});
