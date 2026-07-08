import contactService from "~/server/services/contactService";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({statusCode: 400, statusMessage: 'Missing id parameter'});
  }

  await contactService.deleteContact(id);
  return null;
});
