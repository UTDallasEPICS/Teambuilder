// TODO: Test the Post/Create function
export default defineEventHandler(async event => {
  const { id, name, contact_name, contact_email,Projects, Team } = await readBody(event);
  const postPartner = await event.context.client.project.create({
    data: {
      id: id,
      name: name,
      contact_email: contact_email,
      contact_name: contact_name,
      Projects: Projects,
      Team: Team,
    },
    include: {
      name: true,
    }
  });
  return postPartner;
});
