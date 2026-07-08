import type {PartnerCreate} from "~/server/services/partnerService";
import partnerService from "~/server/services/partnerService";

export default defineEventHandler(async (event) => {
  const data = await readBody<PartnerCreate>(event);
  setResponseStatus(event, 201);
  return await partnerService.createPartner(data);
});
