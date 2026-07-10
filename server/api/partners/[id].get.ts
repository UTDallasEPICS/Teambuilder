import partnerService from "~/server/services/partnerService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const partner = await partnerService.getPartnerById(id);
  if (!partner) {
    throw createError({statusCode: 404, statusMessage: 'Partner not found'});
  }

  return partner;
});
