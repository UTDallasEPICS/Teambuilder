//TODO: Test the Put/Update functionality
export default defineEventHandler(async (event) => {
  const { id, name, contact_name, contact_email, Projects, Team } = await readBody(event);
  const updatePartner = await event.context.client.project.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        contact_email: contact_email,
        contact_name: contact_name,
        Projects: Projects,
        Team: Team,
      },
    })
  return updatePartner;
});
