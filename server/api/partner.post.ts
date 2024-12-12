// TODO: Test the Post/Create function
// TODO: Refer to the FIXME
export default defineEventHandler(async event => {
  const { id, name, contact_email, Projects } = await readBody(event);
  const postPartner = await event.context.client.partner.create({
    data: {
      id: id,
      name: name,
      contact_email: contact_email,
      Projects: {
        //FIXME: possibly debug from here...
        connectOrCreate: Projects.map((project: { name: any; }) => ({
          where: { name: project.name },
          create: { name: project.name },
        })),
      },
      
    },
    include: {
      Projects: true,
      Teams: true
    }
  });
  return postPartner;
});
