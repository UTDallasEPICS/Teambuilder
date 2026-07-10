import type {ContactUpdate} from "~/server/services/contactService";
import contactService from "~/server/services/contactService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const data = await readBody<ContactUpdate>(event);
  return await contactService.updateContact(id, data);
});
