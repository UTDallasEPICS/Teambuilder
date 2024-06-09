export default defineEventHandler(async event => {
  const { id,name, contact_name, contact_email} = await readBody(event);
  await event.context.client.partner.update({
    where: {
      id
    },
    data: {
      name,
      contact_name,
      contact_email,
    },
  });
});
