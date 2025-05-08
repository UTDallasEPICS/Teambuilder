export default defineEventHandler(async (event) => {
  //const {id} = await $fetch('$POSTGRES_PORT:5432');
  //const { id } = await readBody(event);
  const partners = await event.context.client.partner.findMany({
    include: {
      projects: {
        select: {
          name: true,
        },
      },
    },
  });

  // Add flattened projectName field for table filtering
  return partners.map((partner) => ({
    ...partner,
    projectName: partner.projects.map(p => p.name).join(', ') || 'None',
  }));
});
