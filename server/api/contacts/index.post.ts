import type {ContactCreate} from "~/server/services/contactService";
import contactService from "~/server/services/contactService";

export default defineEventHandler(async (event) => {
  const data = await readBody<ContactCreate>(event);
  setResponseStatus(event, 201);
  return await contactService.createContact(data);
});
