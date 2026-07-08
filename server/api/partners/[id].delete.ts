import partnerService from "~/server/services/partnerService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await partnerService.deletePartner(id);
  return null;
});
