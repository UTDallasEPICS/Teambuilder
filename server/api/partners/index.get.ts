import partnerService from "~/server/services/partnerService";

export default defineEventHandler(async () => {
  return await partnerService.getAllPartners();
});
