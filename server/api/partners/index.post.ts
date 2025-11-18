export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Handle array of partners (bulk upload)
  if (Array.isArray(body)) {
    const createdPartners = await Promise.all(
      body.map((partner: any) =>
        event.context.client.partner.create({
          data: {
            name: partner.name,
            contactName: partner.contactName,
            contactEmail: partner.contactEmail
          }
        })
      )
    );
    return createdPartners;
  }

  // Handle single partner (original behavior)
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

