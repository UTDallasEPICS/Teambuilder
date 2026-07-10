import contactService from "~/server/services/contactService";

export default defineEventHandler(async () => {
  return await contactService.getAllContacts();
});
