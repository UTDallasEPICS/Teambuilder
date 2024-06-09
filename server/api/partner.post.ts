export default defineEventHandler(async event => {
  const { name, contact_name, contact_email } = await readBody(event);
    const createdPartner = await event.context.client.partner.create({
      data: {
        name,
        contact_name,
        contact_email,
      },
    });
    return createdPartner
});
