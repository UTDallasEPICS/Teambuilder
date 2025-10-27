// TODO: Test the Post/Create function
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, contactName, contactEmail, projectIds } = body;

  const newPartner = await event.context.client.partner.create({
    data: {
      name,
      contactName,
      contactEmail,
      projects: projectIds
        ? {
            connect: projectIds.map((id: string) => ({ id })),
          }
        : undefined,
    },
    include: {
      projects: true,
    },
  });

  return {
    ...newPartner,
    projectName: newPartner.projects.map(p => p.name).join(', ') || 'None',
  };
});

