import contactService from "~/server/services/contactService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  const contact = await contactService.getContactById(id);
  if (!contact) {
    throw createError({statusCode: 404, statusMessage: 'Contact not found'});
  }

  return contact;
});
