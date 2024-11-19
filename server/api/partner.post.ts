// TODO: Test the Post/Create function
export default defineEventHandler(async event => {
  const { id, name, contact_email } = await readBody(event);
  const postPartner = await event.context.client.partner.create({
    data: {
      id: id,
      name: name,
      contact_email: contact_email,
    },
    include: {
      Projects: true,
      Teams: true
    }
  });
  return postPartner;
});
